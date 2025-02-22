// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Certifique-se que o backend usa essa URL
  timeout: 5000, // Define um timeout para as requisições
});

export default api;
