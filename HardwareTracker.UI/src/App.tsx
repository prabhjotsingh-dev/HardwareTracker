import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import StorageAnalysis from './pages/StorageAnalysis'
import Privacy from './pages/Privacy'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/storage" element={<StorageAnalysis />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>
    </Routes>
  )
}
