import axios from 'axios';

function getAuthHeader() {
  const user = import.meta.env.VITE_WMS_USER as string | undefined;
  const pass = import.meta.env.VITE_WMS_PASS as string | undefined;
  if (user && pass) {
    const token = btoa(`${user}:${pass}`);
    return { Authorization: `Basic ${token}` };
  }
  return {};
}

export const http = axios.create();

http.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (Object.keys(authHeader).length > 0) {
    config.headers = { ...config.headers, ...authHeader } as any;
  }
  return config;
});
