package models

type Product struct {
	ID          int    `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Price       int    `json:"price" db:"price"`
	OldPrice    *int   `json:"old_price,omitempty" db:"old_price"` // Может быть null
	IsSale      bool   `json:"is_sale" db:"is_sale"`
	IsNew       bool   `json:"is_new" db:"is_new"`
	Description string `json:"description" db:"description"`
	ImageURL    string `json:"image_url" db:"image_url"`
	Category    string `json:"category" db:"category"`
	CreatedAt   string `json:"created_at" db:"created_at"`
	UpdatedAt   string `json:"updated_at" db:"updated_at"`
	Stock       int    `json:"stock" db:"stock"`
}

type CreateProductRequest struct {
	Name        string `json:"name" binding:"required"`
	Price       int    `json:"price" binding:"required,min=1"`
	OldPrice    *int   `json:"old_price"`
	IsSale      bool   `json:"is_sale"`
	IsNew       bool   `json:"is_new"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url" binding:"required"`
	Category    string `json:"category" binding:"required"`
}

type UpdateProductRequest struct {
	Name        *string `json:"name"`
	Price       *int    `json:"price"`
	OldPrice    *int    `json:"old_price"`
	IsSale      *bool   `json:"is_sale"`
	IsNew       *bool   `json:"is_new"`
	Description *string `json:"description"`
	ImageURL    *string `json:"image_url"`
	Category    *string `json:"category"`
}
