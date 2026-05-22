package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type OrderItem struct {
	ProductID int    `json:"product_id"`
	Name      string `json:"name"`
	Quantity  int    `json:"quantity"`
	Price     int    `json:"price"`
}

type OrderRequest struct {
	UserID   int64       `json:"user_id"`
	UserName string      `json:"user_name"`
	Username string      `json:"username"`
	Phone    string      `json:"phone"`
	Address  string      `json:"address"`
	Comment  string      `json:"comment"`
	Items    []OrderItem `json:"items"`
	Total    int         `json:"total"`
}

type OrderHandler struct {
	db       *sqlx.DB
	botToken string
	adminIDs []int64
}

func NewOrderHandler(db *sqlx.DB, botToken string, adminIDs []int64) *OrderHandler {
	return &OrderHandler{
		db:       db,
		botToken: botToken,
		adminIDs: adminIDs,
	}
}

func (h *OrderHandler) Create(c *gin.Context) {
	fmt.Println("[Order] === START processing order ===")

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Printf("[Order] ERROR reading body: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot read body"})
		return
	}
	fmt.Printf("[Order] Raw body: %s\n", string(body))
	c.Request.Body = io.NopCloser(bytes.NewBuffer(body))

	var req OrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Printf("[Order] ERROR binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("[Order] Parsed: user_id=%d, phone=%q, address=%q\n", req.UserID, req.Phone, req.Address)

	if req.Phone == "" || req.Address == "" {
		fmt.Println("[Order] ERROR: phone or address empty")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Phone and address are required"})
		return
	}

	itemsJSON, err := json.Marshal(req.Items)
	if err != nil {
		fmt.Printf("[Order] ERROR marshaling items: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal items"})
		return
	}

	var orderID int
	err = h.db.QueryRow(`
		INSERT INTO orders (user_id, user_name, phone, address, comment, items, total, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
		req.UserID, req.UserName, req.Phone, req.Address, req.Comment, itemsJSON, req.Total, "new", time.Now(),
	).Scan(&orderID)
	if err != nil {
		fmt.Printf("[Order] ERROR saving to DB: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save order"})
		return
	}
	fmt.Printf("[Order] Order saved with ID=%d\n", orderID)

	go h.sendNotificationToAdmins(req, orderID)

	c.JSON(http.StatusCreated, gin.H{"message": "Order created", "order_id": orderID})
}

func (h *OrderHandler) sendNotificationToAdmins(order OrderRequest, orderID int) {
	var itemsText string
	for _, item := range order.Items {
		itemsText += fmt.Sprintf("- %s (%d шт.) - %d ₽\n", item.Name, item.Quantity, item.Price*item.Quantity)
	}

	profileLink := fmt.Sprintf("tg://user?id=%d", order.UserID)
	if order.Username != "" {
		profileLink = "https://t.me/" + order.Username
	}

	// Простой текст без Markdown
	text := fmt.Sprintf(`
🛒 НОВЫЙ ЗАКАЗ #%d

Клиент: %s (ID: %d)
Профиль: %s
Телефон: %s
Адрес: %s
Комментарий: %s

Состав заказа:
%s

ИТОГО: %d ₽
`, orderID, order.UserName, order.UserID, profileLink, order.Phone, order.Address, order.Comment, itemsText, order.Total)

	for _, adminID := range h.adminIDs {
		apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", h.botToken)
		payload := map[string]interface{}{
			"chat_id": adminID,
			"text":    text,
			// parse_mode не указываем (простой текст)
		}
		jsonPayload, _ := json.Marshal(payload)
		resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonPayload))
		if err != nil {
			fmt.Printf("[Order] Error sending notification to %d: %v\n", adminID, err)
		} else {
			resp.Body.Close()
			fmt.Printf("[Order] Notification sent to %d, status: %s\n", adminID, resp.Status)
		}
	}
}
