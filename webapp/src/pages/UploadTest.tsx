// src/pages/UploadTest.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function UploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setResultUrl(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Upload failed')
      }
      
      const data = await res.json()
      // Формируем полный URL для проверки
      setResultUrl(`${API_URL}${data.url}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>📸 Тест загрузки фото</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          
          {preview && (
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
            {uploading ? 'Загрузка...' : 'Загрузить на сервер'}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              Ошибка: {error}
            </div>
          )}

          {resultUrl && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm break-all">
              <p className="font-bold text-green-700 mb-1">✅ Успешно!</p>
              <p className="text-gray-600 mb-2">Полный URL:</p>
              <a href={resultUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline block mb-2">
                {resultUrl}
              </a>
              
              <p className="text-gray-600 mb-1">Относительный путь (для БД):</p>
              <code className="bg-white px-2 py-1 rounded border block mb-2 select-all">
                {resultUrl.replace(API_URL, '')}
              </code>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigator.clipboard.writeText(resultUrl.replace(API_URL, ''))}
              >
                Копировать путь для БД
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4 text-center text-xs text-gray-400">
        <p>API Endpoint: {API_URL}/api/upload</p>
        <p>Static Serve: {API_URL}/uploads/...</p>
      </div>
    </div>
  )
}