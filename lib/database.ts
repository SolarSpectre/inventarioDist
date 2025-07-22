import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'inventario',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
};

const pool = mysql.createPool(dbConfig);

export interface Product {
  id?: number;
  name: string;
  description: string;
  image_url: string;
  stock_quantity: number;
  category: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY created_at DESC');
    return rows as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductsBySearch(searchTerm: string): Promise<Product[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY created_at DESC',
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows as Product[];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
    // Check if product with same name already exists
    const [existing] = await pool.execute(
      'SELECT id FROM products WHERE name = ?',
      [product.name]
    );
    
    if ((existing as unknown[]).length > 0) {
      throw new Error('Product with this name already exists');
    }

    const [result] = await pool.execute(
      'INSERT INTO products (name, description, image_url, stock_quantity, category) VALUES (?, ?, ?, ?, ?)',
      [product.name, product.description, product.image_url, product.stock_quantity, product.category]
    );
    
    const insertResult = result as { insertId: number };
    return { ...product, id: insertResult.insertId };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<void> {
  try {
    await pool.execute(
      'UPDATE products SET name = ?, description = ?, image_url = ?, stock_quantity = ?, category = ?, updated_at = NOW() WHERE id = ?',
      [product.name, product.description, product.image_url, product.stock_quantity, product.category, id]
    );
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Initialize database table if it doesn't exist
export async function initializeDatabase(): Promise<void> {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url VARCHAR(500),
        stock_quantity INT NOT NULL DEFAULT 0,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
} 