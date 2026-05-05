package models

type Product struct {
	ID          int     `json:"id" db:"id"`
	Name        string  `json:"name" db:"name"`
	Price       int     `json:"price" db:"price"`                   // цена в копейках
	OldPrice    *int    `json:"old_price,omitempty" db:"old_price"` // старая цена (для скидки)
	IsSale      bool    `json:"is_sale" db:"is_sale"`               // флаг распродажи
	IsNew       bool    `json:"is_new" db:"is_new"`                 // флаг новинки
	Description string  `json:"description" db:"description"`
	ImageURL    string  `json:"image_url" db:"image_url"`
	Category    string  `json:"category" db:"category"`
	CreatedAt   string  `json:"created_at" db:"created_at"`
	UpdatedAt   *string `json:"updated_at,omitempty" db:"updated_at"`
}

type CreateProductRequest struct {
	Name        string `json:"name" binding:"required"`
	Price       int    `json:"price" binding:"required,min=1"`
	OldPrice    *int   `json:"old_price,omitempty"`
	IsSale      bool   `json:"is_sale"`
	IsNew       bool   `json:"is_new"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Category    string `json:"category"`
}

type UpdateProductRequest struct {
	Name        *string `json:"name,omitempty"`
	Price       *int    `json:"price,omitempty"`
	OldPrice    *int    `json:"old_price,omitempty"`
	IsSale      *bool   `json:"is_sale,omitempty"`
	IsNew       *bool   `json:"is_new,omitempty"`
	Description *string `json:"description,omitempty"`
	ImageURL    *string `json:"image_url,omitempty"`
	Category    *string `json:"category,omitempty"`
}
