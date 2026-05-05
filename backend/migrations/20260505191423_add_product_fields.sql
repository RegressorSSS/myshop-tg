-- +goose Up
-- +goose StatementBegin
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS old_price INTEGER,
ADD COLUMN IF NOT EXISTS is_sale BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_sale ON products(is_sale);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE products 
DROP COLUMN IF EXISTS old_price,
DROP COLUMN IF EXISTS is_sale,
DROP COLUMN IF EXISTS updated_at;

DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_price;
DROP INDEX IF EXISTS idx_products_is_new;
DROP INDEX IF EXISTS idx_products_is_sale;
-- +goose StatementEnd