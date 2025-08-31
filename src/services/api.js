// src/services/api.js
import axios from "axios";

/**
 * Instancia Axios centralizada
 * Cambia baseURL si usas variable de entorno en producción.
 */
const api = axios.create({
  baseURL: "https://finanphy.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 15000, // opcional
});

/* -------------------- Auth helpers (token) -------------------- */

/**
 * Setea el token en los headers por defecto y lo guarda en localStorage.
 * Usar cuando el usuario hace login.
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try { localStorage.setItem("finanphy_token", token); } catch (e) {}
  } else {
    delete api.defaults.headers.common["Authorization"];
    try { localStorage.removeItem("finanphy_token"); } catch (e) {}
  }
}

/**
 * Intenta cargar token desde localStorage al iniciar la app.
 */
export function loadAuthTokenFromStorage() {
  try {
    const token = localStorage.getItem("finanphy_token");
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } catch (e) {
    // no-op
  }
}

/**
 * Limpia token (logout).
 */
export function clearAuthToken() {
  delete api.defaults.headers.common["Authorization"];
  try { localStorage.removeItem("finanphy_token"); } catch (e) {}
}

/* Cargar token al arrancar si existe */
loadAuthTokenFromStorage();

/* -------------------- Interceptors -------------------- */

// Response interceptor para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Puedes mejorar este bloque: mostrar toast, redirigir en 401, etc.
    if (error.response) {
      console.error("[API ERROR]", error.response.status, error.response.data);
      // ejemplo: si 401 -> limpiar token (opcional)
      if (error.response.status === 401) {
        // clearAuthToken(); // opcional: descomenta si quieres forzar logout
      }
    } else {
      console.error("[API ERROR] No response:", error.message);
    }
    return Promise.reject(error);
  }
);

/* -------------------- Endpoints helpers -------------------- */
/* Exporto helpers para usar desde componentes (opcionales) */

/* Products */
export const getProducts = (params) => api.get("/products", { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (payload) => api.post("/products", payload);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

/* Incomes (Facturación) */
export const getIncomes = (params) => api.get("/incomes", { params });
export const getIncome = (id) => api.get(`/incomes/${id}`);
export const createIncome = (payload) => api.post("/incomes", payload);
export const updateIncome = (id, payload) => api.put(`/incomes/${id}`, payload);
export const deleteIncome = (id) => api.delete(`/incomes/${id}`);

/* Expenses (si los usas en Clasificación) */
export const getExpenses = (params) => api.get("/expenses", { params });
export const createExpense = (payload) => api.post("/expenses", payload);
export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, payload);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

/* Otros endpoints útiles (según colección) */
/* export const getUsers = (params) => api.get('/users', { params }); */

export default api;
