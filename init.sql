CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(500),
  stock_quantity INT NOT NULL DEFAULT 0,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO products (name, description, image_url, stock_quantity, category) VALUES
('Acoustic Guitar', 'Beautiful handcrafted acoustic guitar with rich sound', 'https://lokeiajtojqquhxmvpss.supabase.co/storage/v1/object/public/product-images/products/a_guitar.webp', 15, 'String Instruments'),
('Electric Piano', 'Professional electric piano with weighted keys', 'https://lokeiajtojqquhxmvpss.supabase.co/storage/v1/object/public/product-images/products/e_piano.jpg', 8, 'Keyboard Instruments'),
('Drum Set', 'Complete 5-piece drum set with cymbals', 'https://lokeiajtojqquhxmvpss.supabase.co/storage/v1/object/public/product-images/products/d_set.webp', 5, 'Percussion'),
('Violin', 'Classical violin with bow and case', 'https://lokeiajtojqquhxmvpss.supabase.co/storage/v1/object/public/product-images/products/violin.jpg', 12, 'String Instruments'),
('Saxophone', 'Alto saxophone in excellent condition', 'https://lokeiajtojqquhxmvpss.supabase.co/storage/v1/object/public/product-images/products/saxofon.jpg', 3, 'Wind Instruments'),
('Bass Guitar', '4-string electric bass guitar', 'https://lokeiajtojqquhxmvpss.supabase.co/storage/v1/object/public/product-images/products/bass.jpg', 10, 'String Instruments'); 