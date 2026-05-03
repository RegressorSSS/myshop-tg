// backend/cmd/main.go
package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"myshop-tg/backend/internal/config"
	"myshop-tg/backend/internal/database"
	"myshop-tg/backend/internal/handlers"
)

func main() {
	// Загрузка конфигурации
	cfg := config.Load()

	// Подключение к базе данных
	db, err := database.New(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Создаём таблицу products, если её нет
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS products (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			price INTEGER NOT NULL,
			description TEXT,
			image_url TEXT,
			category TEXT,
			is_new BOOLEAN DEFAULT false,
			created_at TIMESTAMP DEFAULT NOW()
		)
	`)
	if err != nil {
		log.Fatalf("Failed to create products table: %v", err)
	}

	// Инициализация Gin
	r := gin.Default()

	// Настройка CORS для локальной разработки
	// В продакшене добавьте сюда свой домен
	allowedOrigins := []string{cfg.FrontendURL, "http://localhost:5173", "http://localhost:4173"}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api")
	{
		// Инициализация хендлеров
		ph := handlers.NewProductHandler(db)

		// CRUD для товаров
		api.GET("/products", ph.List)
		api.GET("/products/:id", ph.Get)
		api.POST("/products", ph.Create)       // TODO: добавить проверку админа
		api.PUT("/products/:id", ph.Update)    // TODO: добавить проверку админа
		api.DELETE("/products/:id", ph.Delete) // TODO: добавить проверку админа
	}

	// Запуск сервера
	addr := ":" + cfg.ServerPort
	log.Printf("Server starting on %s", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
