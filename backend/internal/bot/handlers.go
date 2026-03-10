package bot

import (
	"myshop-tg/internal/models"

	tele "gopkg.in/telebot.v3"
)

func HandleStart(c tele.Context) error {
	return c.Send("Привет! Это магазин спортивного инвентаря.\nВведите /catalog для просмотра товаров.")
}

func HandleCatalog(c tele.Context, webAppURL string) error {
	btn := &tele.Btn{
		Text: "Открыть каталог",
		Data: &tele.WebApp{
			URL: webAppURL,
		},
	}

	menu := &tele.ReplyMarkup{}
	menu.Inline(menu.Row(btn))

	return c.Send("Нажмите кнопку, чтобы открыть каталог:", menu)
}

func HandleCart(c tele.Context) error {
	return c.Send("Ваша корзина пуста.")
}

func HandleHelp(c tele.Context) error {
	helpText := `
/start — начать работу
/catalog — открыть каталог
/cart — посмотреть корзину
/help — помощь
`
	return c.Send(helpText)
}

func GetProductsFromDB() []models.Product {
	// Заглушка: возвращаем тестовые товары
	return []models.Product{
		{Name: "Бутсы", Price: 5000, Image: "url1"},
		{Name: "Шиповки", Price: 4000, Image: "url2"},
	}
}
