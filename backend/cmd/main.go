package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"myshop-tg/backend/internal/database"
	"myshop-tg/backend/internal/handlers"
	"myshop-tg/backend/internal/middleware"
	"myshop-tg/backend/pkg/config"
)

func main() {
	// Загрузка .env
	_ = godotenv.Load()
	cfg := config.Load()

	// Подключение к БД
	db, err := database.New(cfg.DatabaseURL)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// Инициализация хендлеров
	productHandler := handlers.NewProductHandler(db)

	// Gin router
	r := gin.Default()

	// CORS (если фронтенд на другом домене)
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

	// Публичные роуты
	public := r.Group("/api")
	{
		public.GET("/products", productHandler.List)
		public.GET("/products/:id", productHandler.Get)
	}

	// Защищённые роуты (требуют Telegram auth)
	protected := r.Group("/api")
	protected.Use(middleware.TelegramAuth(cfg.BotToken))
	{
		protected.POST("/products", productHandler.Create)
		protected.PUT("/products/:id", productHandler.Update)
		protected.DELETE("/products/:id", productHandler.Delete)
		protected.POST("/upload", handlers.UploadImage) // ← загрузка фото
	}

	// Раздача загруженных изображений
	r.Static("/uploads", "./uploads")

	// Запуск сервера
	if err := r.Run(":" + cfg.Port); err != nil {
		panic(err)
	}
}
