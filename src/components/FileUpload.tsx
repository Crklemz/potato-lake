'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

interface FileUploadProps {
  onUpload: (url: string) => void
  onError: (error: string) => void
  type: 'image' | 'file'
  currentUrl?: string | null
  className?: string
  accept?: string
  maxSize?: number
  label?: string
}

export default function FileUpload({
  onUpload,
  onError,
  type,
  currentUrl,
  className = '',
  accept,
  maxSize,
  label
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // File type validation
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const allowedFileTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    const allowedTypes = type === 'image' ? allowedImageTypes : allowedFileTypes
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    }

    // File size validation
    const maxSizeBytes = maxSize || (type === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024)
    if (file.size > maxSizeBytes) {
      const maxSizeMB = maxSizeBytes / (1024 * 1024)
      return `File too large. Maximum size: ${maxSizeMB}MB`
    }

    return null
  }, [type, maxSize])

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      onError(validationError)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      onUpload(data.url)
      setUploadProgress(100)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [validateFile, onUpload, onError, type])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }, [uploadFile])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files[0]
    if (file) {
      uploadFile(file)
    }
  }, [uploadFile])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const getAcceptString = () => {
    if (accept) return accept
    if (type === 'image') return 'image/*'
    return '*/*'
  }

  const getDisplayLabel = () => {
    if (label) return label
    return type === 'image' ? 'Upload Image' : 'Upload File'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-neutral-light hover:border-accent'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="text-primary font-semibold">Uploading...</div>
            <div className="w-full bg-neutral-light rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="text-sm text-neutral-dark">{uploadProgress}%</div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl text-neutral-dark">📁</div>
            <div className="text-lg font-semibold text-neutral-dark">
              {getDisplayLabel()}
            </div>
            <div className="text-sm text-neutral-dark">
              Drag and drop a file here, or click to select
            </div>
            <div className="text-xs text-neutral-dark">
              {type === 'image' ? 'Images up to 5MB' : 'Files up to 10MB'}
            </div>
          </div>
        )}
      </div>

      {currentUrl && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-neutral-dark">Current File:</div>
          {type === 'image' ? (
            <div className="relative">
              <div className="w-32 h-24 relative rounded-lg border">
                <Image 
                  src={currentUrl} 
                  alt="Current upload"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <a 
                href={currentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-xs text-accent hover:text-primary mt-1"
              >
                View Full Size →
              </a>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-dark">📄</span>
              <a 
                href={currentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-primary"
              >
                View File →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 