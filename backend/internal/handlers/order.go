package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"myshop-tg/backend/internal/models"
)

func CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Order created", "order": order})
}

func GetOrders(c *gin.Context) {
	c.JSON(http.StatusOK, []models.Order{})
}