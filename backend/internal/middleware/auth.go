package middleware

import (
	"fmt"
	"net/url"

	"myshop-tg/backend/internal/auth"

	"github.com/gin-gonic/gin"
)

const userContextKey = "telegram_user"

func TelegramAuth(botToken string) gin.HandlerFunc {
	return func(c *gin.Context) {
		initData := c.GetHeader("X-Telegram-Init-Data")
		if initData == "" {
			initData = c.Query("initData")
		}
		if initData == "" {
			fmt.Println("[TelegramAuth] ERROR: No initData in header or query")
			c.JSON(401, gin.H{"error": "Missing Telegram initData"})
			c.Abort()
			return
		}
		fmt.Println("[TelegramAuth] Received initData (first 100 chars):", initData[:min(100, len(initData))])

		// Декодируем URL-encoded строку (Telegram может её кодировать)
		decodedInitData, err := url.QueryUnescape(initData)
		if err != nil {
			fmt.Println("[TelegramAuth] ERROR: Failed to decode initData:", err)
			c.JSON(401, gin.H{"error": "Invalid initData encoding"})
			c.Abort()
			return
		}
		fmt.Println("[TelegramAuth] Decoded initData (first 100 chars):", decodedInitData[:min(100, len(decodedInitData))])

		authData, err := auth.ValidateInitData(decodedInitData, botToken)
		if err != nil {
			fmt.Println("[TelegramAuth] ERROR: ValidateInitData failed:", err)
			c.JSON(401, gin.H{"error": "Invalid Telegram initData"})
			c.Abort()
			return
		}
		if !authData.IsValid {
			fmt.Println("[TelegramAuth] ERROR: authData.IsValid = false")
			c.JSON(401, gin.H{"error": "Invalid Telegram initData"})
			c.Abort()
			return
		}
		fmt.Printf("[TelegramAuth] SUCCESS: user ID = %d, name = %s %s\n", authData.User.ID, authData.User.FirstName, authData.User.LastName)

		c.Set(userContextKey, authData.User)
		c.Next()
	}
}

func GetUserFromContext(c *gin.Context) (*auth.TelegramUser, bool) {
	val, exists := c.Get(userContextKey)
	if !exists {
		fmt.Println("[GetUserFromContext] User not found in context")
		return nil, false
	}
	user, ok := val.(auth.TelegramUser)
	if !ok {
		fmt.Println("[GetUserFromContext] Context value is not TelegramUser")
		return nil, false
	}
	return &user, true
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
