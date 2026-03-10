package bot

import (
	"log"
	"os"
	"time"

	"myshop-tg/internal/database"

	tele "gopkg.in/telebot.v3"
)

func Start(db *database.DB) {
	token := os.Getenv("TELEGRAM_TOKEN")
	if token == "" {
		log.Fatal("TELEGRAM_TOKEN must be set")
	}

	pref := tele.Settings{
		Token:  token,
		Poller: &tele.LongPoller{Timeout: 10 * time.Second},
	}

	botInstance, err := tele.NewBot(pref)
	if err != nil {
		log.Fatal(err)
	}

	webAppURL := "https://myshop-tg.vercel.app/catalog" // Заменить на реальный URL

	botInstance.Handle("/start", func(c tele.Context) error {
		return HandleStart(c)
	})

	botInstance.Handle("/catalog", func(c tele.Context) error {
		return HandleCatalog(c, webAppURL)
	})

	botInstance.Handle("/cart", func(c tele.Context) error {
		return HandleCart(c)
	})

	botInstance.Handle("/help", func(c tele.Context) error {
		return HandleHelp(c)
	})

	log.Println("Бот запущен...")
	botInstance.Start()
}
