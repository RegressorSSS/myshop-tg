import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

declare global {
  interface Window {
    Telegram?: any
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function AdminEditProduct() {
  const navigate = useNavigate()
  const { id } = useParams() // Получаем ID товара из URL
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Бутсы',
    isNew: false,
    isSale: false,
    oldPrice: '',
    currentImageUrl: '' // Храним текущий URL картинки
  })

  // Загружаем данные товара при открытии страницы
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`)
        if (!res.ok) throw new Error('Товар не найден')
        const data = await res.json()
        
        setForm({
          name: data.name,
          price: data.price.toString(),
          description: data.description || '',
          category: data.category,
          isNew: data.is_new,
          isSale: data.is_sale,
          oldPrice: data.old_price ? data.old_price.toString() : '',
          currentImageUrl: data.image_url
        })
        setPreview(data.image_url ? `${API_URL}${data.image_url}` : null)
      } catch (err) {
        console.error(err)
        alert('Ошибка загрузки товара')
        navigate('/')
      } finally {
        setFetching(false)
      }
    }
    
    if (id) fetchProduct()
  }, [id, navigate])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    let imageUrl = form.currentImageUrl // По умолчанию оставляем старую картинку

    try {
      // Если выбрали новое фото — загружаем его
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadRes.ok) throw new Error('Ошибка загрузки фото')
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url // Обновляем URL на новый
      }

      const initData = window.Telegram?.WebApp?.initData || ''

      // Обновляем товар
      const productRes = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT', // Используем PUT для обновления
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': encodeURIComponent(initData),
        },
        body: JSON.stringify({
          name: form.name,
          price: parseInt(form.price),
          description: form.description,
          image_url: imageUrl, // Старый или новый URL
          category: form.category,
          is_new: form.isNew,
          is_sale: form.isSale,
          old_price: form.oldPrice ? parseInt(form.oldPrice) : null
        }),
      })

      if (!productRes.ok) {
        const errText = await productRes.text()
        throw new Error(errText || 'Ошибка обновления товара')
      }
      
      alert('Товар успешно обновлен!')
      navigate('/')
    } catch (err: any) {
      console.error(err)
      alert('Ошибка: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto mb-2" /> Загрузка...</div>

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <Card>
        <CardHeader>
          <CardTitle>✏️ Редактировать товар</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Загрузка фото */}
            <div className="space-y-2">
              <Label>Фото товара</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              <p className="text-xs text-gray-500">Оставьте пустым, чтобы сохранить текущее фото</p>
              
              {preview && (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mt-2 border">
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
                <Label>Старая цена</Label>
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
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}