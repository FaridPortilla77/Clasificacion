import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Modal (crear / editar)
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null => crear, objeto => editar
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    cost: "",
    stock: "",
  });

  // Fetch productos
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products");
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrado por búsqueda
  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.sku || "").toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(productosFiltrados.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return productosFiltrados.slice(start, start + pageSize);
  }, [productosFiltrados, page]);

  // Handlers modal / form
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", sku: "", price: "", cost: "", stock: "" });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      price: product.price ?? "",
      cost: product.cost ?? "",
      stock: product.stock ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ name: "", sku: "", price: "", cost: "", stock: "" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Validaciones básicas
    if (!form.name || !form.sku) {
      alert("Completa el nombre y el SKU.");
      return;
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      stock: Number(form.stock) || 0,
    };

    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      await fetchProductos();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error en la operación. Revisa la consola.");
    }
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(`Eliminar producto "${product.name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      await api.delete(`/products/${product._id}`);
      await fetchProductos();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el producto.");
    }
  };

  const exportCSV = () => {
    const header = "sku,name,price,cost,stock\n";
    const rows = productosFiltrados
      .map((p) =>
        [
          `"${p.sku ?? ""}"`,
          `"${(p.name ?? "").replace(/"/g, '""')}"`,
          p.price ?? 0,
          p.cost ?? 0,
          p.stock ?? 0,
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventario.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventario</h1>
            <p className="text-sm text-slate-500">Gestión de productos — crear, editar y eliminar.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
            />
            <button
              onClick={exportCSV}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
            >
              Exportar CSV
            </button>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            >
              + Producto
            </button>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}

        {loading ? (
          <div className="text-center py-10 text-slate-500">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No hay productos para mostrar.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">SKU</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Precio</th>
                    <th className="px-4 py-3 text-left">Costo</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-slate-600">{p.sku}</td>
                      <td className={`px-4 py-3 ${p.stock <= 5 ? "text-red-500 font-semibold" : ""}`}>
                        {p.stock}
                        {p.stock <= 5 && <span className="ml-2 text-xs text-red-400">Bajo</span>}
                      </td>
                      <td className="px-4 py-3">{currencyFormatter.format(p.price ?? 0)}</td>
                      <td className="px-4 py-3">{currencyFormatter.format(p.cost ?? 0)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEdit(p)}
                          className="mr-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Mostrando {Math.min((page - 1) * pageSize + 1, productosFiltrados.length)} -{" "}
                {Math.min(page * pageSize, productosFiltrados.length)} de {productosFiltrados.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Anterior
                </button>

                {/* simple page numbers */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const num = i + 1;
                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-3 py-1 rounded ${page === num ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`}
                    >
                      {num}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal crear / editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">{editing ? "Editar producto" : "Nuevo producto"}</h2>

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-3">
              <label className="text-sm">Nombre</label>
              <input name="name" value={form.name} onChange={handleFormChange} className="p-2 border rounded" required />

              <label className="text-sm">SKU</label>
              <input name="sku" value={form.sku} onChange={handleFormChange} className="p-2 border rounded" required />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Precio</label>
                  <input name="price" value={form.price} onChange={handleFormChange} type="number" step="0.01" className="p-2 border rounded" />
                </div>
                <div>
                  <label className="text-sm">Costo</label>
                  <input name="cost" value={form.cost} onChange={handleFormChange} type="number" step="0.01" className="p-2 border rounded" />
                </div>
              </div>

              <label className="text-sm">Stock</label>
              <input name="stock" value={form.stock} onChange={handleFormChange} type="number" className="p-2 border rounded" />

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">{editing ? "Actualizar" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
