import React from "react";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

const datos = [
  { fecha: "2025-01-10", descripcion: "Compra de insumos", monto: -120000, tipo: "gasto" },
  { fecha: "2025-01-15", descripcion: "Venta producto A", monto: 200000, tipo: "ingreso" },
  { fecha: "2025-02-05", descripcion: "Pago de servicios", monto: -80000, tipo: "gasto" },
  { fecha: "2025-02-07", descripcion: "Servicio prestado", monto: 150000, tipo: "ingreso" },
];

const datosOrdenados = [...datos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

const totalIngresos = datos
  .filter(d => d.tipo === "ingreso")
  .reduce((acc, d) => acc + d.monto, 0);
const totalGastos = datos
  .filter(d => d.tipo === "gasto")
  .reduce((acc, d) => acc + Math.abs(d.monto), 0);

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const Clasificacion = () => {
  const balance = totalIngresos - totalGastos;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12 px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            Pestaña de Clasificación
          </h1>
          <p className="text-slate-300 text-lg">
            Análisis detallado de ingresos y gastos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 py-12">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Tarjeta de Gastos */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-500 to-red-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-xl">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>
                <span className="text-2xl group-hover:scale-110 transition-transform">💸</span>
              </div>
              <h3 className="text-red-700 font-semibold text-lg mb-2">Total Gastos</h3>
              <p className="text-3xl font-bold text-red-700 mb-1">
                {formatoCOP.format(totalGastos)}
              </p>
              <p className="text-red-500 text-sm">
                {datos.filter(d => d.tipo === "gasto").length} transacciones
              </p>
            </div>
          </div>

          {/* Tarjeta de Ingresos */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                </div>
                <span className="text-2xl group-hover:scale-110 transition-transform">💰</span>
              </div>
              <h3 className="text-green-700 font-semibold text-lg mb-2">Total Ingresos</h3>
              <p className="text-3xl font-bold text-green-700 mb-1">
                {formatoCOP.format(totalIngresos)}
              </p>
              <p className="text-green-500 text-sm">
                {datos.filter(d => d.tipo === "ingreso").length} transacciones
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Cronología de Transacciones
            </h2>
            <p className="text-slate-500">
              Flujo detallado de movimientos financieros ordenados por fecha
            </p>
          </div>

          <div className="relative w-full max-w-6xl mx-auto">
            {/* Línea vertical central  */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-300 h-full rounded-full shadow-sm" />

            {/* Grid alineado */}
            <div className="relative">
              {datosOrdenados.map((item, index) => (
                <div key={index} className="flex items-center relative mb-16 last:mb-0">
                  
                  {/* COLUMNA IZQUIERDA - GASTOS */}
                  <div className="w-5/12 pr-8">
                    {item.tipo === "gasto" && (
                      <div className="flex justify-end">
                        <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm group hover:scale-105 relative">
                          {/* Línea conectora */}
                          <div className="absolute right-0 top-1/2 w-8 h-0.5 bg-gradient-to-r from-red-300 to-slate-400 transform translate-x-full" />
                          
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                                GASTO
                              </span>
                              <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                </svg>
                              </div>
                            </div>
                            <p className="text-slate-600 text-xs font-medium mb-2 uppercase tracking-wide">
                              {formatearFecha(item.fecha)}
                            </p>
                            <h4 className="font-semibold text-slate-800 text-sm mb-3">
                              {item.descripcion}
                            </h4>
                            <p className="text-2xl font-bold text-red-600">
                              -{formatoCOP.format(Math.abs(item.monto))}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PUNTO CENTRAL */}
                  <div className="w-2/12 flex justify-center relative z-10">
                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg ${
                      item.tipo === "gasto" 
                        ? "bg-gradient-to-br from-red-400 to-red-600" 
                        : "bg-gradient-to-br from-green-400 to-emerald-600"
                    }`} />
                  </div>

                  {/* COLUMNA DERECHA - INGRESOS */}
                  <div className="w-5/12 pl-8">
                    {item.tipo === "ingreso" && (
                      <div className="flex justify-start">
                        <div className="bg-white border-l-4 border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm group hover:scale-105 relative">
                          {/* Línea conectora */}
                          <div className="absolute left-0 top-1/2 w-8 h-0.5 bg-gradient-to-l from-green-300 to-slate-400 transform -translate-x-full" />
                          
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                INGRESO
                              </span>
                              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                                </svg>
                              </div>
                            </div>
                            <p className="text-slate-600 text-xs font-medium mb-2 uppercase tracking-wide">
                              {formatearFecha(item.fecha)}
                            </p>
                            <h4 className="font-semibold text-slate-800 text-sm mb-3">
                              {item.descripcion}
                            </h4>
                            <p className="text-2xl font-bold text-green-600">
                              +{formatoCOP.format(Math.abs(item.monto))}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clasificacion;