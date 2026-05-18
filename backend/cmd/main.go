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
	productHandler := handlers.NewProductHandler(db, cfg.AdminUserID)

	// Gin router
	r := gin.Default()

	// CORS
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

	// Публичные роуты (доступны всем)
	public := r.Group("/api")
	{
		public.GET("/products", productHandler.List)
		public.GET("/products/:id", productHandler.Get)

	}
  
  r.POST("/upload", handlers.UploadImage)

	// Защищённые роуты (требуют Telegram auth и прав админа для POST/PUT/DELETE)
	protected := r.Group("/api")
	protected.Use(middleware.TelegramAuth(cfg.TelegramBotToken))
	{
		protected.POST("/products", productHandler.Create)       // Только админ
		protected.PUT("/products/:id", productHandler.Update)    // Только админ
		protected.DELETE("/products/:id", productHandler.Delete) // Только админ
	}

	// Раздача загруженных изображений
	r.Static("/uploads", "./uploads")

	// Запуск сервера
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		panic(err)
	}
}