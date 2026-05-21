package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/url"
	"sort"
	"strings"
)

type TelegramUser struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	PhotoURL  string `json:"photo_url"`
}

type AuthData struct {
	User      TelegramUser
	IsValid   bool
	AuthDate  int64
	QueryID   string
}

func ValidateInitData(initData string, botToken string) (*AuthData, error) {
	params, err := url.ParseQuery(initData)
	if err != nil {
		return nil, err
	}

	hash := params.Get("hash")
	if hash == "" {
		return nil, errors.New("missing hash")
	}
	params.Del("hash")

	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var dataCheckParts []string
	for _, k := range keys {
		dataCheckParts = append(dataCheckParts, k+"="+params.Get(k))
	}
	dataCheckString := strings.Join(dataCheckParts, "\n")

	secretKey := hmac.New(sha256.New, []byte("WebAppData"))
	secretKey.Write([]byte(botToken))
	secret := secretKey.Sum(nil)

	h := hmac.New(sha256.New, secret)
	h.Write([]byte(dataCheckString))
	expectedHash := hex.EncodeToString(h.Sum(nil))

	if !hmac.Equal([]byte(hash), []byte(expectedHash)) {
		return nil, errors.New("invalid hash")
	}

	var user TelegramUser
	if userStr := params.Get("user"); userStr != "" {
		userStrDecoded, _ := url.QueryUnescape(userStr)
		if err := json.Unmarshal([]byte(userStrDecoded), &user); err != nil {
			if err := json.Unmarshal([]byte(userStr), &user); err != nil {
				return nil, err
			}
		}
	}

	authDate := int64(0)
	if dateStr := params.Get("auth_date"); dateStr != "" {
		// parse if needed
	}

	return &AuthData{
		User:     user,
		IsValid:  true,
		AuthDate: authDate,
		QueryID:  params.Get("query_id"),
	}, nil
}
