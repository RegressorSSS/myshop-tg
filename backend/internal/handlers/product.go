package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"myshop-tg/backend/internal/middleware"
	"myshop-tg/backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ProductHandler struct {
	db           *sqlx.DB
	adminUserIDs []int64
}

func NewProductHandler(db *sqlx.DB, adminUserIDs []int64) *ProductHandler {
	return &ProductHandler{db: db, adminUserIDs: adminUserIDs}
}

func (h *ProductHandler) isAdmin(userID int64) bool {
	for _, id := range h.adminUserIDs {
		if id == userID {
			return true
		}
	}
	return false
}

// GET /products — список товаров (публичный)
func (h *ProductHandler) List(c *gin.Context) {
	category := c.Query("category")
	search := c.Query("search")
	minPrice := c.Query("min_price")
	maxPrice := c.Query("max_price")
	isNew := c.Query("new") == "true"
	isSale := c.Query("sale") == "true"
	sortBy := c.DefaultQuery("sort", "created_at")
	limit := c.DefaultQuery("limit", "20")
	offset := c.DefaultQuery("offset", "0")

	query := `SELECT * FROM products WHERE 1=1`
	args := []interface{}{}

	if category != "" {
		query += " AND category = $" + fmt.Sprint(len(args)+1)
		args = append(args, category)
	}
	if search != "" {
		query += " AND (name ILIKE $" + fmt.Sprint(len(args)+1) + " OR description ILIKE $" + fmt.Sprint(len(args)+2) + ")"
		searchTerm := "%" + search + "%"
		args = append(args, searchTerm, searchTerm)
	}
	if minPrice != "" {
		query += " AND price >= $" + fmt.Sprint(len(args)+1)
		args = append(args, minPrice)
	}
	if maxPrice != "" {
		query += " AND price <= $" + fmt.Sprint(len(args)+1)
		args = append(args, maxPrice)
	}
	if isNew {
		query += " AND is_new = true"
	}
	if isSale {
		query += " AND is_sale = true"
	}

	switch sortBy {
	case "price_asc":
		query += " ORDER BY price ASC"
	case "price_desc":
		query += " ORDER BY price DESC"
	case "name":
		query += " ORDER BY name ASC"
	default:
		query += " ORDER BY created_at DESC"
	}

	query += " LIMIT $" + fmt.Sprint(len(args)+1) + " OFFSET $" + fmt.Sprint(len(args)+2)
	args = append(args, limit, offset)

	var products []models.Product
	if err := h.db.Select(&products, query, args...); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"total":    len(products),
		"limit":    limit,
		"offset":   offset,
	})
}

// GET /products/:id — публичный
func (h *ProductHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	err := h.db.Get(&product, "SELECT * FROM products WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// POST /products — создать товар (только админ)
func (h *ProductHandler) Create(c *gin.Context) {
	user, ok := middleware.GetUserFromContext(c)
	if !ok || !h.isAdmin(user.ID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	var req models.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var id int
	err := h.db.QueryRow(
		`INSERT INTO products (name, price, old_price, is_sale, is_new, description, image_url, category) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
		req.Name, req.Price, req.OldPrice, req.IsSale, req.IsNew, req.Description, req.ImageURL, req.Category,
	).Scan(&id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id, "message": "Product created"})
}

// PUT /products/:id — обновить товар (только админ)
func (h *ProductHandler) Update(c *gin.Context) {
	user, ok := middleware.GetUserFromContext(c)
	if !ok || !h.isAdmin(user.ID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	id := c.Param("id")
	var req models.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := []string{}
	args := []interface{}{}
	argIndex := 1

	if req.Name != nil {
		updates = append(updates, fmt.Sprintf("name=$%d", argIndex))
		args = append(args, *req.Name)
		argIndex++
	}
	if req.Price != nil {
		updates = append(updates, fmt.Sprintf("price=$%d", argIndex))
		args = append(args, *req.Price)
		argIndex++
	}
	if req.OldPrice != nil {
		updates = append(updates, fmt.Sprintf("old_price=$%d", argIndex))
		args = append(args, *req.OldPrice)
		argIndex++
	}
	if req.IsSale != nil {
		updates = append(updates, fmt.Sprintf("is_sale=$%d", argIndex))
		args = append(args, *req.IsSale)
		argIndex++
	}
	if req.IsNew != nil {
		updates = append(updates, fmt.Sprintf("is_new=$%d", argIndex))
		args = append(args, *req.IsNew)
		argIndex++
	}
	if req.Description != nil {
		updates = append(updates, fmt.Sprintf("description=$%d", argIndex))
		args = append(args, *req.Description)
		argIndex++
	}
	if req.ImageURL != nil {
		updates = append(updates, fmt.Sprintf("image_url=$%d", argIndex))
		args = append(args, *req.ImageURL)
		argIndex++
	}
	if req.Category != nil {
		updates = append(updates, fmt.Sprintf("category=$%d", argIndex))
		args = append(args, *req.Category)
		argIndex++
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No fields to update"})
		return
	}

	updates = append(updates, "updated_at=NOW()")
	args = append(args, id)
	whereIndex := len(args)

	query := fmt.Sprintf("UPDATE products SET %s WHERE id=$%d", strings.Join(updates, ", "), whereIndex)

	_, err := h.db.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated"})
}

// POST /upload — загрузка изображения (публичный)
func (h *ProductHandler) UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	ext := filepath.Ext(file.Filename)
	newFileName := uuid.New().String() + ext
	uploadDir := "/var/www/myshop-tg/uploads"

	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
		return
	}

	savePath := filepath.Join(uploadDir, newFileName)
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	imageURL := "/uploads/" + newFileName
	c.JSON(http.StatusOK, gin.H{"image_url": imageURL})
}

// DELETE /products/:id — удалить товар (только админ)
func (h *ProductHandler) Delete(c *gin.Context) {
	user, ok := middleware.GetUserFromContext(c)
	if !ok || !h.isAdmin(user.ID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	id := c.Param("id")
	_, err := h.db.Exec("DELETE FROM products WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}
