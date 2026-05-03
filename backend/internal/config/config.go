// internal/config/config.go
package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort       string
	DatabaseURL      string
	FrontendURL      string
	TelegramBotToken string
	AdminUserID      int64
}

func Load() *Config {
	// 🟢 ЗАГРУЖАЕМ .env файл!
	// Если файла нет — ошибка игнорируется, будут использованы дефолтные значения
	_ = godotenv.Load()

	// Для отладки: раскомментируй, чтобы видеть загруженные значения в консоли
	// log.Println("✅ Loaded DATABASE_URL:", os.Getenv("DATABASE_URL"))

	return &Config{
		ServerPort:       getEnv("SERVER_PORT", "8080"),
		DatabaseURL:      getEnv("DATABASE_URL", "postgres://dzhumali:12345@localhost:5433/myshop?sslmode=disable"),
		FrontendURL:      getEnv("FRONTEND_URL", "http://localhost:5173"),
		TelegramBotToken: getEnv("TELEGRAM_BOT_TOKEN", ""),
		AdminUserID:      getEnvInt64("ADMIN_USER_ID", 0),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt64(key string, defaultValue int64) int64 {
	// Упрощённая версия — можно расширить парсингом через strconv
	return defaultValue
}
