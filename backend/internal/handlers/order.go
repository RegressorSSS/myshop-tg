// После INSERT в БД:
go func() {
	err := telegramService.SendOrderNotification(
		orderID,
		user.FirstName,
		user.ID,
		req.TotalAmount,
		previews, // преобразуй из req.Items
		req.Comment,
	)
	if err != nil {
		println("Telegram notify error:", err.Error())
	}
}()