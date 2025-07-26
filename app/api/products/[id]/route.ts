import { NextRequest, NextResponse } from "next/server";
import {
  deleteProduct,
  updateProduct,
  getProductById,
} from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const id = extractIdFromRequest(request);
    if (id === null) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = extractIdFromRequest(request);
    if (id === null) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, image_url, stock_quantity, category } = body;

    if (!name || !description || !category || stock_quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await updateProduct(id, {
      name,
      description,
      image_url: image_url || "",
      stock_quantity: parseInt(stock_quantity) || 0,
      category,
    });

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = extractIdFromRequest(request);
    if (id === null) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await deleteProduct(id);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

function extractIdFromRequest(request: NextRequest): number | null {
  const idParam = request.nextUrl.pathname.split("/").pop();
  const id = idParam ? parseInt(idParam, 10) : NaN;
  return isNaN(id) ? null : id;
}
