import axios from 'axios';
  import Swal from 'sweetalert2'
// import { toast } from 'vue-sonner';

const API_BASE = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    let textError: string

    if (!error.response) {
      textError = 'Tidak ada koneksi internet';
    } else if (status >= 500) {
      textError = 'Server Error. Coba lagi nanti.';
    } else if (status === 404) {
      textError = 'Data tidak ditemukan';
    } else if (status === 401 || status === 403) {
      textError = 'Anda tidak memiliki akses';
      // Redirect ke login jika perlu
      // router.push('/login')
    } else if (status === 400) {
      textError = message || 'Request tidak valid';
    } else {
      textError = message || 'Terjadi kesalahan';
    }

    Swal.fire({
      title: "Error",
      text: textError,
      showConfirmButton: false,
      timer: 3000,
      icon: "error"
    });
  }
);

// Type declaration untuk custom config
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
  }
}