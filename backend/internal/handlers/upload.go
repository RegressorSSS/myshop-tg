package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	MaxUploadSize = 10 << 20 // 10 MB
	UploadDir     = "./uploads"
)

var AllowedTypes = map[string]bool{
	".jpg": true, ".jpeg": true, ".png": true, ".webp": true,
}

// UploadImage обрабатывает загрузку изображения
func UploadImage(c *gin.Context) {
	// Ограничиваем размер запроса
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		return
	}

	// Валидация расширения
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !AllowedTypes[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File type not allowed"})
		return
	}

	// Генерируем уникальное имя файла
	buf := make([]byte, 16)
	_, _ = rand.Read(buf)
	uniqueName := hex.EncodeToString(buf) + ext
	filePath := filepath.Join(UploadDir, uniqueName)

	// Создаём директорию, если не существует
	if err := os.MkdirAll(UploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Сохраняем файл
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Возвращаем публичный URL
	publicURL := "/uploads/" + uniqueName
	c.JSON(http.StatusCreated, gin.H{"url": publicURL, "filename": uniqueName})
}
