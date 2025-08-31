import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/facturacion", label: "Facturación" },
    { path: "/inventario", label: "Inventario" },
    { path: "/clientes", label: "Clientes" },
    { path: "/pagos", label: "Pagos" },
    { path: "/clasificacion", label: "Clasificación" }, // ingresos y gastos
    { path: "/reportes", label: "Reportes" },
  ];

  return (
    <aside className="w-64 bg-[#0B0F1A] text-slate-300 h-screen flex flex-col p-6">
      {/* Logo / Nombre de la App */}
      <h2 className="text-indigo-400 text-2xl font-bold mb-8 tracking-wide text-center">
        Finanphy
      </h2>

      {/* Menú */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {/* Indicador circular */}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-blue-400" : "bg-gray-500"
                    }`}
                  ></span>

                  {/* Texto */}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer opcional */}
      <div className="mt-6 text-xs text-slate-500 text-center">
        © {new Date().getFullYear()} Finanphy
      </div>
    </aside>
  );
};

export default Sidebar;
