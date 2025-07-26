"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from "@/lib/database"

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  product?: Product | null;
}

export function ProductForm({
  onSubmit,
  onCancel,
  isLoading = false,
  product = null,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    stock_quantity: 0,
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        stock_quantity: product.stock_quantity,
        image_url: product.image_url,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        stock_quantity: 0,
        image_url: "",
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripcion es requerida'
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'La categoria es requerida'
    }
    
    if (formData.stock_quantity < 0) {
      newErrors.stock_quantity = 'La cantidad de stock no puede ser negativa'
    }
    
    if (!imageFile && !formData.image_url) {
      newErrors.image = 'Sube una imagen o ingresa una url'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error uploading image')
    }

    const { url } = await response.json()
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setUploading(true)
      
      let finalImageUrl = formData.image_url
      
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile)
      }

      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        stock_quantity: formData.stock_quantity,
        image_url: finalImageUrl
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        stock_quantity: 0,
        image_url: "",
      });
      setImageFile(null)
      setErrors({})
      
    } catch (error) {
      console.error('Error creating product:', error)
      setErrors({ submit: 'Failed to create product. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setFormData(prev => ({ ...prev, image_url: '' }))
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, image_url: e.target.value }))
    setImageFile(null)
    setErrors(prev => ({ ...prev, image: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Producto *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }))
            setErrors(prev => ({ ...prev, name: '' }))
          }}
          placeholder="Ingresa el nombre del producto"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripcion *</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, description: e.target.value }))
            setErrors(prev => ({ ...prev, description: '' }))
          }}
          placeholder="Ingresa la descripcion del producto"
          className={`w-full p-2 border rounded-md resize-none h-20 ${
            errors.description ? 'border-red-500' : 'border-input'
          }`}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, category: e.target.value }))
            setErrors(prev => ({ ...prev, category: '' }))
          }}
          placeholder="Ingresa la categoria del producto"
          className={errors.category ? 'border-red-500' : ''}
        />
        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_quantity">Cantidad de Stock *</Label>
        <Input
          id="stock_quantity"
          type="number"
          min="0"
          value={formData.stock_quantity}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))
            setErrors(prev => ({ ...prev, stock_quantity: '' }))
          }}
          placeholder="Ingresa la cantidad de stock del producto"
          className={errors.stock_quantity ? 'border-red-500' : ''}
        />
        {errors.stock_quantity && <p className="text-sm text-red-500">{errors.stock_quantity}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagen del Producto</Label>
        <div className="space-y-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={errors.image ? 'border-red-500' : ''}
          />
          <p className="text-sm text-gray-500">O ingresa una URL de imagen:</p>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={handleImageUrlChange}
            className={errors.image ? 'border-red-500' : ''}
          />
        </div>
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={uploading || isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={uploading || isLoading}>
          {isLoading
            ? product
              ? "Actualizando..."
              : "Creando..."
            : product
            ? "Actualizar Producto"
            : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
} 