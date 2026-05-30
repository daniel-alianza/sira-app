import axios from 'axios';

export const siraApi = axios.create({
  baseURL: `${import.meta.env.VITE_SIR_API_URL}/api`,
  withCredentials: true,
});
