package main

import (
	"log"
	"myshop/internal/delivery/http"
	"myshop/internal/repository"
	"myshop/internal/usecase"
	"myshop/pkg/db"

	"github.com/gin-gonic/gin"
)

func main() {
	// DB
	database, err := db.NewPostgres()
	if err != nil {
		log.Fatal(err)
	}

	// layers
	productRepo := repository.NewProductRepository(database)
	productUC := usecase.NewProductUsecase(productRepo)
	handler := http.NewHandler(productUC)

	// server
	r := gin.Default()
	handler.Register(r)

	r.Run(":8080")
}
