package main

import (
	"log"
	"os"

	"my-shop-tg/internal/bot"
	"my-shop-tg/internal/database"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func main() {
	token := os.Getenv("TELEGRAM_TOKEN")
	if token == "" {
		log.Fatal("TELEGRAM_TOKEN должен быть указан")
	}

	botInstance, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		log.Panic(err)
	}

	db := database.Connect()
	defer db.Close()

	bot.Start(botInstance, db)
}
