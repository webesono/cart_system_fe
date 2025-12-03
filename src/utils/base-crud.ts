import { api } from './api';

export class BaseCRUD<T> {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }
  
    async getAll(params?: any): Promise<T[]> {
        const res = await api.get(this.endpoint, { params });
        return res.data;
    }

    async getById(id: number | string): Promise<T> {
        const res = await api.get(`${this.endpoint}/${id}`);
        return res.data;
    }

    async create(data: Partial<T>): Promise<T> {
        const res = await api.post(this.endpoint, data);
        return res.data;
    }

    async update(id: number | string, data: Partial<T>): Promise<T> {
        const res = await api.put(`${this.endpoint}/${id}`, data);
        return res.data;
    }

    async delete(id: number | string): Promise<boolean> {
        await api.delete(`${this.endpoint}/${id}`);
        return true;
    }
}
