package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type TelegramService struct {
	BotToken string
	AdminID  int64
}

func NewTelegramService(botToken string, adminID int64) *TelegramService {
	return &TelegramService{BotToken: botToken, AdminID: adminID}
}

func (s *TelegramService) SendOrderNotification(orderID int, userFirstName string, userID int64, total int, items []OrderItemPreview, comment string) error {
	text := fmt.Sprintf(
		"📦 <b>Новый заказ #%d</b>\n\n"+
			"👤 Пользователь: %s (ID: %d)\n"+
			"💰 Сумма: %d ₽\n",
		orderID, userFirstName, userID, total,
	)

	if comment != "" {
		text += fmt.Sprintf("📝 Комментарий: %s\n", comment)
	}

	text += "\n📦 Товары:\n"
	for _, item := range items {
		line := fmt.Sprintf("- %s ×%d", item.Name, item.Qty)
		if item.Size != "" {
			line += fmt.Sprintf(" (%s)", item.Size)
		}
		if item.Color != "" {
			line += fmt.Sprintf(" / %s", item.Color)
		}
		text += line + "\n"
	}

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", s.BotToken)
	payload := map[string]interface{}{
		"chat_id":    s.AdminID,
		"text":       text,
		"parse_mode": "HTML",
	}

	body, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	return nil
}

type OrderItemPreview struct {
	Name  string
	Qty   int
	Size  string
	Color string
}
