"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from "@/lib/database"

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({ onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    stock_quantity: 0,
    image_url: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }
    
    if (formData.stock_quantity < 0) {
      newErrors.stock_quantity = 'Stock quantity cannot be negative'
    }
    
    if (!imageFile && !formData.image_url) {
      newErrors.image = 'Either upload an image or provide an image URL'
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
        name: '',
        description: '',
        category: '',
        stock_quantity: 0,
        image_url: ''
      })
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
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }))
            setErrors(prev => ({ ...prev, name: '' }))
          }}
          placeholder="Enter product name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, description: e.target.value }))
            setErrors(prev => ({ ...prev, description: '' }))
          }}
          placeholder="Enter product description"
          className={`w-full p-2 border rounded-md resize-none h-20 ${
            errors.description ? 'border-red-500' : 'border-input'
          }`}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, category: e.target.value }))
            setErrors(prev => ({ ...prev, category: '' }))
          }}
          placeholder="Enter product category"
          className={errors.category ? 'border-red-500' : ''}
        />
        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_quantity">Stock Quantity *</Label>
        <Input
          id="stock_quantity"
          type="number"
          min="0"
          value={formData.stock_quantity}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))
            setErrors(prev => ({ ...prev, stock_quantity: '' }))
          }}
          placeholder="Enter stock quantity"
          className={errors.stock_quantity ? 'border-red-500' : ''}
        />
        {errors.stock_quantity && <p className="text-sm text-red-500">{errors.stock_quantity}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Product Image</Label>
        <div className="space-y-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={errors.image ? 'border-red-500' : ''}
          />
          <p className="text-sm text-gray-500">Or provide an image URL:</p>
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
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={uploading || isLoading}
        >
          {uploading || isLoading ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
} 