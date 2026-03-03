package bot

import (
	"myshop-tg/internal/database"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func Start(bot *tgbotapi.BotAPI, db *database.DB) {
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.GetUpdatesChan(u)

	for update := range updates {
		if update.Message != nil && update.Message.IsCommand() {
			switch update.Message.Command() {
			case "start":
				msg := tgbotapi.NewMessage(update.Message.Chat.ID, "Добро пожаловать! /catalog - каталог товаров")
				bot.Send(msg)
			case "catalog":
				webAppMsg := tgbotapi.NewMessage(update.Message.Chat.ID, "Открыть каталог:")
				webAppMsg.ReplyMarkup = tgbotapi.NewInlineKeyboardMarkup(
					tgbotapi.NewInlineKeyboardRow(
						tgbotapi.NewInlineKeyboardButtonWebApp("Каталог", "https://your-app-url.vercel.app/catalog"),
					),
				)
				bot.Send(webAppMsg)
			}
		}
	}
}
