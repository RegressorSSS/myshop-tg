package models

import "time"

type Order struct {
	ID        int       `db:"id" json:"id"`
	UserID    int64     `db:"user_id" json:"user_id"`
	Total     int       `db:"total" json:"total"`
	Status    string    `db:"status" json:"status"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type OrderItem struct {
	ID        int    `db:"id" json:"id"`
	OrderID   int    `db:"order_id" json:"order_id"`
	ProductID int    `db:"product_id" json:"product_id"`
	Quantity  int    `db:"quantity" json:"quantity"`
	Price     int    `db:"price" json:"price"`
}