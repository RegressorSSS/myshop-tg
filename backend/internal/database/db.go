// backend/internal/database/db.go
package database

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func New(dbURL string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		return nil, err
	}
	// Настройки пула соединений (опционально)
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	return db, nil
}
