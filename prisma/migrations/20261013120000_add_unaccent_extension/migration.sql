-- List endpoints match `q` with unaccent(column) ILIKE unaccent(pattern), so a
-- search for "cabeca" finds "cabeça".
CREATE EXTENSION IF NOT EXISTS unaccent;
