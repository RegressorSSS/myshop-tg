-- +goose Up
ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 1;

-- +goose Down
ALTER TABLE products DROP COLUMN stock;
