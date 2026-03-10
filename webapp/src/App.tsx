import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
          <Link to="/">Главная</Link> |{' '}
          <Link to="/admin">Админка</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;