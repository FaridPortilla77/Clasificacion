import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Clasificacion from "./pages/Clasificacion";
import Facturacion from "./pages/Facturacion";
import Inventario from "./pages/Inventario";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Menú lateral */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-1 p-6 bg-slate-100 min-h-screen">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clasificacion" element={<Clasificacion />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/inventario" element={<Inventario />} />
            {/* Rutas futuras */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
