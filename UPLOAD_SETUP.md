# File Upload Setup Guide

## Overview
The Potato Lake website now includes file upload functionality using Vercel Blob for secure, scalable file storage.

## Features Implemented

### ✅ Upload Components
- **Resort Images**: Upload resort logos and photos (5MB max)
- **Event Images**: Upload event photos and graphics (5MB max)
- **Resource Files**: Upload PDFs, documents, and other files (10MB max)
- **Sponsor Logos**: Upload sponsor logos and images (5MB max)

### ✅ Upload Features
- **Drag & Drop**: Intuitive drag-and-drop interface
- **File Validation**: Client and server-side validation
- **Progress Indicators**: Real-time upload progress
- **Error Handling**: Comprehensive error messages
- **File Previews**: Preview uploaded images and files
- **Secure Storage**: Files stored in Vercel Blob with public access

## Setup Instructions

### 1. Vercel Blob Configuration

#### For Local Development:
1. Create a Vercel account if you don't have one
2. Create a new Vercel project or use an existing one
3. Go to your Vercel project dashboard
4. Navigate to **Storage** → **Blob**
5. Create a new Blob store
6. Copy the `BLOB_READ_WRITE_TOKEN`

#### Update Environment Variables:
```bash
# In your .env.local file, update:
BLOB_READ_WRITE_TOKEN="your-actual-vercel-blob-token"
```

### 2. File Type Support

#### Images (5MB max):
- JPEG/JPG
- PNG
- WebP
- GIF

#### Documents (10MB max):
- PDF
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Plain Text (.txt)
- Images (same as above)

### 3. Usage

#### For Resort Images:
1. Go to `/admin/resorts-edit`
2. Click "Add New Resort" or "Edit" an existing resort
3. Use the "Upload Resort Image" area
4. Drag and drop an image or click to browse
5. The image URL will be automatically saved

#### For Event Images:
1. Go to `/admin/events-edit`
2. Click "Add New Event" or "Edit" an existing event
3. Use the "Upload Event Image" area
4. Upload your event image
5. The image URL will be automatically saved

#### For Resource Files:
1. Go to `/admin/resources-edit`
2. Click "Add New Resource" or "Edit" an existing resource
3. Use the "Upload Resource File" area
4. Upload PDFs, documents, or other files
5. The file URL will be automatically saved

#### For Sponsor Logos:
1. Go to `/admin/sponsors-edit`
2. Click "Add New Sponsor" or "Edit" an existing sponsor
3. Use the "Upload Sponsor Logo" area
4. Upload the sponsor logo
5. The logo URL will be automatically saved

## Security Features

### ✅ Authentication
- All uploads require admin authentication
- Session validation on every upload request

### ✅ File Validation
- **Client-side**: Immediate feedback on file type and size
- **Server-side**: Secure validation before storage
- **Type checking**: Whitelist of allowed file types
- **Size limits**: Configurable file size restrictions

### ✅ Storage Security
- Files stored in Vercel Blob with public access
- Unique filename generation to prevent conflicts
- No direct file system access

## Error Handling

### Common Error Messages:
- **"Invalid file type"**: File type not in allowed list
- **"File too large"**: File exceeds size limit
- **"Upload failed"**: Network or server error
- **"Unauthorized"**: Not logged in as admin

### Troubleshooting:
1. **Check file type**: Ensure file is in allowed format
2. **Check file size**: Reduce file size if too large
3. **Check authentication**: Ensure you're logged in as admin
4. **Check network**: Ensure stable internet connection
5. **Check Vercel Blob token**: Verify token is correct

## API Endpoints

### Upload Endpoint:
- **URL**: `/api/upload`
- **Method**: `POST`
- **Authentication**: Required (admin session)
- **Content-Type**: `multipart/form-data`

### Request Parameters:
- `file`: The file to upload
- `type`: Either "image" or "file"

### Response:
```json
{
  "url": "https://blob.vercel-storage.com/...",
  "filename": "image/1234567890-abc123.jpg",
  "size": 1024000,
  "type": "image/jpeg"
}
```

## Development Notes

### File Upload Component:
- **Location**: `src/components/FileUpload.tsx`
- **Reusable**: Can be used across different admin forms
- **Configurable**: Accepts props for file type, size limits, etc.

### Upload API:
- **Location**: `src/app/api/upload/route.ts`
- **Secure**: Includes authentication and validation
- **Scalable**: Uses Vercel Blob for storage

### Integration:
- All admin forms now include file upload functionality
- URLs are automatically saved to database
- Existing URL fields converted to hidden inputs
- Upload errors displayed inline

## Production Deployment

### Vercel Deployment:
1. Set `BLOB_READ_WRITE_TOKEN` in Vercel environment variables
2. Deploy your application
3. File uploads will work automatically

### Environment Variables:
```bash
# Required for production:
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
DATABASE_URL="your-database-url"
```

## Support

For issues with file uploads:
1. Check the browser console for client-side errors
2. Check the server logs for API errors
3. Verify Vercel Blob configuration
4. Ensure proper authentication
5. Validate file types and sizes 