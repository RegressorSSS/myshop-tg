// internal/handlers/product.go
package handlers

import (
	"myshop-tg/backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type ProductHandler struct {
	db *sqlx.DB
}

func NewProductHandler(db *sqlx.DB) *ProductHandler {
	return &ProductHandler{db: db}
}

// GET /api/products — список товаров
func (h *ProductHandler) List(c *gin.Context) {
	var products []models.Product
	err := h.db.Select(&products, "SELECT * FROM products ORDER BY created_at DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// GET /api/products/:id — товар по ID
func (h *ProductHandler) Get(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	err := h.db.Get(&product, "SELECT * FROM products WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// POST /api/products — создать товар (только админ)
func (h *ProductHandler) Create(c *gin.Context) {
	var req models.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var id int
	err := h.db.QueryRow(
		`INSERT INTO products (name, price, description, image_url, category, is_new) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
		req.Name, req.Price, req.Description, req.ImageURL, req.Category, req.IsNew,
	).Scan(&id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": id, "message": "Product created"})
}

// PUT /api/products/:id — обновить товар
func (h *ProductHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req models.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.db.Exec(
		`UPDATE products SET name=$1, price=$2, description=$3, image_url=$4, category=$5, is_new=$6 
         WHERE id=$7`,
		req.Name, req.Price, req.Description, req.ImageURL, req.Category, req.IsNew, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated"})
}

// DELETE /api/products/:id — удалить товар
func (h *ProductHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	_, err := h.db.Exec("DELETE FROM products WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}
