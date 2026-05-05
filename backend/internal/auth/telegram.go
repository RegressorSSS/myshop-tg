package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"
)

type TelegramUser struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	IsBot     bool   `json:"is_bot"`
}

type AuthData struct {
	User     TelegramUser
	RawData  string
	AuthDate time.Time
	IsValid  bool
}

func ValidateInitData(initData, botToken string) (*AuthData, error) {
	values, err := url.ParseQuery(initData)
	if err != nil {
		return nil, fmt.Errorf("failed to parse initData: %w", err)
	}

	hash := values.Get("hash")
	values.Del("hash")

	// Сортируем параметры для создания check string
	var keys []string
	for k := range values {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var dataCheck []string
	for _, k := range keys {
		if v := values.Get(k); v != "" {
			dataCheck = append(dataCheck, k+"="+v)
		}
	}
	dataCheckString := strings.Join(dataCheck, "\n")

	// Создаём секретный ключ
	secretKey := hmac.New(sha256.New, []byte("WebAppData"))
	secretKey.Write([]byte(botToken))

	// Проверяем hash
	mac := hmac.New(sha256.New, secretKey.Sum(nil))
	mac.Write([]byte(dataCheckString))
	expectedHash := hex.EncodeToString(mac.Sum(nil))

	if !hmac.Equal([]byte(hash), []byte(expectedHash)) {
		return nil, fmt.Errorf("invalid hash")
	}

	// Проверяем время (не старше 24 часов)
	authDateStr := values.Get("auth_date")
	authDate, err := strconv.ParseInt(authDateStr, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid auth_date: %w", err)
	}

	if time.Now().Unix()-authDate > 86400 {
		return nil, fmt.Errorf("initData expired")
	}

	// Парсим пользователя
	user := TelegramUser{
		ID:        parseInt64(values.Get("id")),
		FirstName: values.Get("first_name"),
		LastName:  values.Get("last_name"),
		Username:  values.Get("username"),
		IsBot:     values.Get("is_bot") == "true",
	}

	return &AuthData{
		User:     user,
		RawData:  initData,
		AuthDate: time.Unix(authDate, 0),
		IsValid:  true,
	}, nil
}

func parseInt64(s string) int64 {
	v, _ := strconv.ParseInt(s, 10, 64)
	return v
}
