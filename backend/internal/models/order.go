type OrderItem struct {
	ProductID int    `json:"product_id"`
	Quantity  int    `json:"quantity"`
	Size      string `json:"size,omitempty"`
	Color     string `json:"color,omitempty"`
}

type CreateOrderRequest struct {
	Items       []OrderItem `json:"items"`
	TotalAmount int         `json:"total_amount"`
	Comment     string      `json:"comment,omitempty"` // Опционально
}