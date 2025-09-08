import React, { useEffect, useState, useMemo } from "react";
import { getIncomes, getExpenses, getInvestments } from "../services/api";
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

const Reportes = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incRes, expRes, invRes] = await Promise.all([
        getIncomes(),
        getExpenses(),
        getInvestments(),
      ]);
      setIncomes(Array.isArray(incRes.data) ? incRes.data : []);
      setExpenses(Array.isArray(expRes.data) ? expRes.data : []);
      setInvestments(Array.isArray(invRes.data) ? invRes.data : []);
    } catch (err) {
      console.error("Error cargando datos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Totales
  const totalIngresos = useMemo(
    () => incomes.reduce((acc, i) => acc + Number(i.amount || 0), 0),
    [incomes]
  );
  const totalGastos = useMemo(
    () => expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0),
    [expenses]
  );
  const totalInversiones = useMemo(
    () => investments.reduce((acc, inv) => acc + Number(inv.amount || 0), 0),
    [investments]
  );
  const balance = totalIngresos - (totalGastos + totalInversiones);

  // Datos para gráficos
  const chartData = [
    { name: "Ingresos", value: totalIngresos },
    { name: "Gastos", value: totalGastos },
    { name: "Inversiones", value: totalInversiones },
  ];

  const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">📊 Reportes</h1>
          <p className="text-slate-600">
            Dashboard financiero: ingresos, gastos e inversiones
          </p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-emerald-500">
            <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Ingresos
            </h3>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              {formatoCOP.format(totalIngresos)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-red-500">
            <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" /> Gastos
            </h3>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {formatoCOP.format(totalGastos)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border-t-4 border-blue-500">
            <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" /> Inversiones
            </h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {formatoCOP.format(totalInversiones)}
            </p>
          </div>

          <div
            className={`bg-white rounded-2xl shadow p-6 border-t-4 ${
              balance < 0 ? "border-red-500" : "border-emerald-500"
            }`}
          >
            <h3 className="text-sm font-medium text-slate-500 flex items-center gap-2">
              Balance
              {balance < 0 && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </h3>
            <p
              className={`text-2xl font-bold mt-2 ${
                balance < 0 ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {formatoCOP.format(balance)}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Diagrama de Barras */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold text-slate-700 mb-4">
              Comparativo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(val) => formatoCOP.format(val)} />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Diagrama de Pastel */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold text-slate-700 mb-4">
              Distribución
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatoCOP.format(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
