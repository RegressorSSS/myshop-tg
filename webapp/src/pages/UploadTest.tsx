import { useState } from 'react'
import { api } from '../lib/api' // ✅ Добавь импорт

export default function UploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await api.upload(formData) // ✅ Заменили
      if (!res.ok) throw new Error('Ошибка загрузки')

      const data = await res.json()
      setResult(data.url)
    } catch (err: any) {
      console.error(err)
      setResult('Ошибка: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <h1 className="text-xl font-bold mb-4">🧪 Тест загрузки</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        
        {preview && (
          <div className="mt-2">
            <p>Предпросмотр:</p>
            <img src={preview} alt="Preview" className="w-32 h-32 object-contain border" />
          </div>
        )}

        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          disabled={loading || !file}
        >
          {loading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md">
          <p>Результат:</p>
          <p className="break-all">{result}</p>
        </div>
      )}
    </div>
  )
}