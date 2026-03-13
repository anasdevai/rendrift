import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4001';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export const auth = {
    signup: (email: string, password: string) => 
        api.post('/api/auth/signup', { email, password }),
    login: (email: string, password: string) => 
        api.post('/api/auth/login', { email, password }),
};

export const jobs = {
    create: (videoFile: File) => {
        const formData = new FormData();
        formData.append('video', videoFile);
        return api.post('/api/jobs/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    get: (id: string) => api.get(`/api/jobs/${id}`),
    getAll: () => api.get('/api/jobs'),
};

export default api;
