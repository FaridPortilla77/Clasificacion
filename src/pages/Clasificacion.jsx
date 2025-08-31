import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api"; // RUTA CORRECTA

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Clasificacion = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/transacciones");
      const payload = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.transactions || [];

      const normalized = payload.map((item, i) => ({
        id: item.id ?? i,
        fecha: item.fecha,
        descripcion: item.descripcion ?? item.description ?? "",
        monto: Number(item.monto) || 0,
        tipo: (item.tipo || "").toLowerCase(),
      }));

      setDatos(normalized);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al consultar las transacciones"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const datosOrdenados = useMemo(
    () => [...datos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)),
    [datos]
  );

  const totalIngresos = useMemo(
    () =>
      datos
        .filter((d) => d.tipo === "ingreso")
        .reduce((acc, d) => acc + Math.abs(Number(d.monto)), 0),
    [datos]
  );

  const totalGastos = useMemo(
    () =>
      datos
        .filter((d) => d.tipo === "gasto")
        .reduce((acc, d) => acc + Math.abs(Number(d.monto)), 0),
    [datos]
  );

  const balance = totalIngresos - totalGastos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12 px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              Pestaña de Clasificación
            </h1>
            <p className="text-slate-300 text-lg">
              Análisis detallado de ingresos y gastos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <div className="text-sm text-slate-300">Balance</div>
              <div
                className={`font-bold ${
                  balance < 0 ? "text-red-300" : "text-emerald-200"
                }`}
              >
                {formatoCOP.format(balance)}
              </div>
            </div>

            <button
              onClick={fetchData}
              className="bg-white text-slate-800 px-4 py-2 rounded-lg shadow hover:shadow-md transition"
              aria-label="Refrescar transacciones"
            >
              {loading ? "Cargando..." : "Refrescar"}
            </button>
          </div>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto px-10 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700">
            {error}
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        {/* ... resto del JSX sin cambios ... */}
      </div>
    </div>
  );
};

export default Clasificacion;
