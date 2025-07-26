import { NextRequest, NextResponse } from "next/server";
import {
  getProducts,
  createProduct,
  initializeDatabase,
} from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Initialize database if needed
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let products;
    if (search) {
      const { getProductsBySearch } = await import("@/lib/database");
      products = await getProductsBySearch(search);
    } else {
      products = await getProducts();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image_url, stock_quantity, category } = body;

    // Validate required fields
    if (!name || !description || !category || stock_quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize database if needed
    await initializeDatabase();

    const product = await createProduct({
      name,
      description,
      image_url: image_url || "",
      stock_quantity: parseInt(stock_quantity) || 0,
      category,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);

    if (
      error instanceof Error &&
      error.message === "Producto con este nombre ya existe"
    ) {
      return NextResponse.json(
        { error: "Producto con este nombre ya existe" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
} 