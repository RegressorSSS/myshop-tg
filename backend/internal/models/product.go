// internal/models/product.go
package models

type Product struct {
	ID          int    `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Price       int    `json:"price" db:"price"` // в копейках
	Description string `json:"description" db:"description"`
	ImageURL    string `json:"image_url" db:"image_url"`
	Category    string `json:"category" db:"category"`
	IsNew       bool   `json:"is_new" db:"is_new"`
	CreatedAt   string `json:"created_at" db:"created_at"`
}

type CreateProductRequest struct {
	Name        string `json:"name" binding:"required"`
	Price       int    `json:"price" binding:"required,min=1"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Category    string `json:"category"`
	IsNew       bool   `json:"is_new"`
}
