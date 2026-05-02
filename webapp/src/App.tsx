import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WebApp } from '@twa-dev/sdk'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'

function App() {
  useEffect(() => {
    // Проверяем, что WebApp существует (работаем внутри Telegram)
    if (WebApp) {
      // Сообщаем Telegram, что приложение готово
      WebApp.ready()
      // Разворачиваем на весь экран
      WebApp.expand()
      
      // Адаптация цветов под тему Telegram
      if (WebApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App