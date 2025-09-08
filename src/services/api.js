import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "https://finanphy.onrender.com";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  // withCredentials: false, // activa si necesitas enviar cookies si tu backend lo requiere
});

/* --- Manejo de Token --- */
export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export function clearAuthToken() {
  delete api.defaults.headers.common["Authorization"];
}

/* --- Interceptor de Errores --- */
api.interceptors.response.use(
  (response) => response,
  (err) => {
    console.error(
      "[API ERROR]",
      err.response?.status,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

/* ================================
   PRODUCTOS
================================ */
export const getProducts = (params) => api.get("/products", { params });
export const createProduct = (payload) => api.post("/products", payload);
export const updateProduct = (id, payload) =>
  api.put(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

/* ================================
   CLIENTES (basados en Users)
================================ */
export const getClientes = () => api.get("/api/users");
export const createCliente = (payload) => api.post("/auth/register", payload);
// ⚠️ Falta confirmar si el backend expone update/delete para clientes (users)

/* ================================
   INGRESOS (Incomes)
================================ */
export const getIncomes = () => api.get("/incomes");
export const createIncome = (payload) => api.post("/incomes", payload);
// Opcional: update/delete si tu backend lo soporta
// export const updateIncome = (id, payload) => api.put(`/incomes/${id}`, payload);
// export const deleteIncome = (id) => api.delete(`/incomes/${id}`);

/* ================================
   GASTOS (Expenses)
================================ */
export const getExpenses = () => api.get("/expenses");
export const createExpense = (payload) => api.post("/expenses", payload);
// export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, payload);
// export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

/* ================================
   INVERSIONES (Investments)
================================ */
export const getInvestments = () => api.get("/investments");
export const createInvestment = (payload) => api.post("/investments", payload);
// export const updateInvestment = (id, payload) => api.put(`/investments/${id}`, payload);
// export const deleteInvestment = (id) => api.delete(`/investments/${id}`);

export default api;
