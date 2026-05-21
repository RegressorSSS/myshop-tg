package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
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
	fmt.Println("[ValidateInitData] Start validation")
	params, err := url.ParseQuery(initData)
	if err != nil {
		fmt.Println("[ValidateInitData] ParseQuery error:", err)
		return nil, err
	}

	hash := params.Get("hash")
	if hash == "" {
		fmt.Println("[ValidateInitData] ERROR: missing hash")
		return nil, errors.New("missing hash")
	}
	fmt.Println("[ValidateInitData] hash from params:", hash)
	params.Del("hash")

	keys := make([]string, 0, len(params))
	for k := range params {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	fmt.Println("[ValidateInitData] Sorted keys:", keys)

	var dataCheckParts []string
	for _, k := range keys {
		dataCheckParts = append(dataCheckParts, k+"="+params.Get(k))
	}
	dataCheckString := strings.Join(dataCheckParts, "\n")
	fmt.Println("[ValidateInitData] Data check string:\n", dataCheckString)

	secretKey := hmac.New(sha256.New, []byte("WebAppData"))
	secretKey.Write([]byte(botToken))
	secret := secretKey.Sum(nil)

	h := hmac.New(sha256.New, secret)
	h.Write([]byte(dataCheckString))
	expectedHash := hex.EncodeToString(h.Sum(nil))
	fmt.Println("[ValidateInitData] Expected hash:", expectedHash)

	if !hmac.Equal([]byte(hash), []byte(expectedHash)) {
		fmt.Println("[ValidateInitData] ERROR: hash mismatch")
		return nil, errors.New("invalid hash")
	}
	fmt.Println("[ValidateInitData] Hash is valid")

	var user TelegramUser
	if userStr := params.Get("user"); userStr != "" {
		userStrDecoded, _ := url.QueryUnescape(userStr)
		if err := json.Unmarshal([]byte(userStrDecoded), &user); err != nil {
			if err := json.Unmarshal([]byte(userStr), &user); err != nil {
				fmt.Println("[ValidateInitData] ERROR: failed to parse user:", err)
				return nil, err
			}
		}
		fmt.Printf("[ValidateInitData] Parsed user: ID=%d, Name=%s %s\n", user.ID, user.FirstName, user.LastName)
	} else {
		fmt.Println("[ValidateInitData] No user field in params")
	}

	authDate := int64(0)
	if dateStr := params.Get("auth_date"); dateStr != "" {
		// можно распарсить, но пока не нужно
	}

	return &AuthData{
		User:     user,
		IsValid:  true,
		AuthDate: authDate,
		QueryID:  params.Get("query_id"),
	}, nil
}
