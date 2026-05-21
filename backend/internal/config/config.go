package config

import (
	"os"
	"strconv"
)

type Config struct {
	ServerPort      string
	DatabaseURL     string
	TelegramBotToken string
	AdminUserID     int64
}

func Load() *Config {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	adminIDStr := os.Getenv("ADMIN_USER_ID")
	var adminID int64 = 0
	if adminIDStr != "" {
		id, err := strconv.ParseInt(adminIDStr, 10, 64)
		if err == nil {
			adminID = id
		}
	}

	return &Config{
		ServerPort:       port,
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		TelegramBotToken: os.Getenv("TELEGRAM_BOT_TOKEN"),
		AdminUserID:      adminID,
	}
}
