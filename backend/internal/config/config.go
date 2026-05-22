package config

import (
	"os"
	"strconv"
	"strings"
)

type Config struct {
	ServerPort       string
	DatabaseURL      string
	TelegramBotToken string
	AdminUserIDs     []int64
}

func Load() *Config {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	adminIDsStr := os.Getenv("ADMIN_USER_ID")
	var adminIDs []int64
	if adminIDsStr != "" {
		parts := strings.Split(adminIDsStr, ",")
		for _, part := range parts {
			id, err := strconv.ParseInt(strings.TrimSpace(part), 10, 64)
			if err == nil {
				adminIDs = append(adminIDs, id)
			}
		}
	}

	return &Config{
		ServerPort:       port,
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		TelegramBotToken: os.Getenv("TELEGRAM_BOT_TOKEN"),
		AdminUserIDs:     adminIDs,
	}
}
