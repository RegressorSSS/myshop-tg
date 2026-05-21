package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"myshop-tg/backend/internal/config"
	"myshop-tg/backend/internal/database"
	"myshop-tg/backend/internal/handlers"
	"myshop-tg/backend/internal/middleware"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()

	db, err := database.New(cfg.DatabaseURL)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	r := gin.Default()
	r.SetTrustedProxies([]string{"127.0.0.1"})

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, X-Telegram-Init-Data")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	productHandler := handlers.NewProductHandler(db, cfg.AdminUserID)

	r.GET("/products", productHandler.List)
	r.GET("/products/:id", productHandler.Get)

	protected := r.Group("")
	protected.Use(middleware.TelegramAuth(cfg.TelegramBotToken))
	{
		protected.POST("/products", productHandler.Create)
		protected.PUT("/products/:id", productHandler.Update)
		protected.DELETE("/products/:id", productHandler.Delete)
		protected.POST("/upload", productHandler.UploadImage)
	}

	r.Static("/uploads", "/var/www/myshop-tg/uploads")

	if err := r.Run(":" + cfg.ServerPort); err != nil {
		panic(err)
	}
}
