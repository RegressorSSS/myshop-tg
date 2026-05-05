package middleware

import (
	"net/url"

	"myshop-tg/backend/internal/auth"

	"github.com/gin-gonic/gin"
)

const userContextKey = "telegram_user"

// TelegramAuth — Gin middleware для проверки initData
func TelegramAuth(botToken string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Пробуем получить initData из заголовка или query
		initData := c.GetHeader("X-Telegram-Init-Data")
		if initData == "" {
			initData = c.Query("initData")
		}
		if initData == "" {
			c.JSON(401, gin.H{"error": "Missing Telegram initData"})
			c.Abort()
			return
		}

		// Декодируем (Telegram отправляет URL-encoded)
		initData, _ = url.QueryUnescape(initData)

		authData, err := auth.ValidateInitData(initData, botToken)
		if err != nil || !authData.IsValid {
			c.JSON(401, gin.H{"error": "Invalid Telegram initData"})
			c.Abort()
			return
		}

		// Сохраняем пользователя в контекст Gin
		c.Set(userContextKey, authData.User)
		c.Next()
	}
}

// GetUserFromContext — извлечение пользователя из Gin-контекста
func GetUserFromContext(c *gin.Context) (*auth.TelegramUser, bool) {
	val, exists := c.Get(userContextKey)
	if !exists {
		return nil, false
	}
	user, ok := val.(auth.TelegramUser)
	return &user, ok
}

// RequireAdmin — middleware для проверки, что пользователь — админ
func RequireAdmin(adminID int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, ok := GetUserFromContext(c)
		if !ok || user.ID != adminID {
			c.JSON(403, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}
