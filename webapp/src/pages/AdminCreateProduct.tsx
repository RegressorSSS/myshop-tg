import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

// Объявляем тип для window.Telegram
declare global {
  interface Window {
    Telegram?: any
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function AdminCreateProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Бутсы',
    isNew: false,
    isSale: false,
    oldPrice: ''
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      alert('Выберите изображение!')
      return
    }

    setLoading(true)
    try {
      // 1. Загружаем фото
      const formData = new FormData()
      formData.append('image', imageFile)
      
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!uploadRes.ok) throw new Error('Ошибка загрузки фото')
      const uploadData = await uploadRes.json()
      const imageUrl = uploadData.url 

      // 2. Получаем initData для авторизации
      const initData = window.Telegram?.WebApp?.initData || ''

      // 3. Создаем товар
      const productRes = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': encodeURIComponent(initData), // <-- Авторизация
        },
        body: JSON.stringify({
          name: form.name,
          price: parseInt(form.price),
          description: form.description,
          image_url: imageUrl,
          category: form.category,
          is_new: form.isNew,
          is_sale: form.isSale,
          old_price: form.oldPrice ? parseInt(form.oldPrice) : null
        }),
      })

      if (!productRes.ok) {
        const errText = await productRes.text()
        throw new Error(errText || 'Ошибка создания товара')
      }
      
      alert('Товар успешно создан!')
      navigate('/')
    } catch (err: any) {
      console.error(err)
      alert('Ошибка: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <Card>
        <CardHeader>
          <CardTitle>➕ Добавить новый товар</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Загрузка фото */}
            <div className="space-y-2">
              <Label>Фото товара</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mt-2">
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Название</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Цена (₽)</Label>
                <Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Старая цена (опционально)</Label>
                <Input type="number" value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Категория</Label>
              <select 
                className="w-full p-2 border rounded-md bg-white"
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})}
              >
                <option value="Бутсы">Бутсы</option>
                <option value="Мячи">Мячи</option>
                <option value="Экипировка">Экипировка</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={form.isNew} onChange={e => setForm({...form, isNew: e.target.checked})} />
                <span>Новинка</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={form.isSale} onChange={e => setForm({...form, isSale: e.target.checked})} />
                <span>Распродажа</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Создание...' : 'Создать товар'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}