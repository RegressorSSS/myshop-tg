package main

import (
	"myshop-tg/internal/bot"
	"myshop-tg/internal/database"
)

func main() {
	db := database.Connect()
	defer db.Close()

	bot.Start(db)
}
