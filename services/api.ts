/**
 * API Service Layer
 * Handles all API requests to DuitKu backend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://duitku.agriconnect.my.id/api/v1';

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  meta?: any;
  errors?: Record<string, string[]>;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
}

class ApiService {
  private async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  // Auth Endpoints
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.data?.token) {
      await AsyncStorage.setItem('token', data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }

  async register(name: string, email: string, password: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: {
        name,
        email,
        password,
        password_confirmation: password,
      },
    });
    if (data.data?.token) {
      await AsyncStorage.setItem('token', data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
    }
    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    await AsyncStorage.multiRemove(['token', 'user']);
  }

  async getUser() {
    return await this.request('/auth/user');
  }

  // Dashboard Endpoints
  async getDashboard() {
    return await this.request('/dashboard');
  }

  async getDashboardStats(period: string = 'month') {
    return await this.request(`/dashboard/stats?period=${period}`);
  }

  // Transaction Endpoints
  async getTransactions(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return await this.request(`/transactions?${query}`);
  }

  async getTransaction(id: number) {
    return await this.request(`/transactions/${id}`);
  }

  async createTransaction(data: {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category_id: number;
    date: string;
    notes?: string;
  }) {
    return await this.request('/transactions', {
      method: 'POST',
      body: data,
    });
  }

  async updateTransaction(id: number, data: Partial<{
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category_id: number;
    date: string;
    notes?: string;
  }>) {
    return await this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteTransaction(id: number) {
    return await this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(period: string = 'month') {
    return await this.request(`/transactions-stats?period=${period}`);
  }

  // Category Endpoints
  async getCategories(type?: 'income' | 'expense') {
    const query = type ? `?type=${type}` : '';
    return await this.request(`/categories${query}`);
  }

  async createCategory(data: {
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
  }) {
    return await this.request('/categories', {
      method: 'POST',
      body: data,
    });
  }

  async updateCategory(id: number, data: Partial<{
    name: string;
    type: 'income' | 'expense';
    icon: string;
    color: string;
  }>) {
    return await this.request(`/categories/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteCategory(id: number) {
    return await this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategoryBreakdown(type: 'income' | 'expense' = 'expense', year?: number, month?: number) {
    const params = new URLSearchParams({ type });
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return await this.request(`/categories-breakdown?${params}`);
  }

  // Budget Endpoints
  async getBudgets() {
    return await this.request('/budgets');
  }

  async createBudget(data: {
    category_id: number;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    start_date: string;
    alert_threshold?: number;
  }) {
    return await this.request('/budgets', {
      method: 'POST',
      body: data,
    });
  }

  async updateBudget(id: number, data: Partial<{
    category_id: number;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    start_date: string;
    alert_threshold?: number;
  }>) {
    return await this.request(`/budgets/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteBudget(id: number) {
    return await this.request(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  async getBudgetSummary() {
    return await this.request('/budgets-summary');
  }

  // Report Endpoints
  async getReports(year?: number, month?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return await this.request(`/reports?${params}`);
  }

  async getMonthlyReport(year?: number, month?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return await this.request(`/reports/monthly?${params}`);
  }

  async getDailyTrend(year?: number, month?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return await this.request(`/reports/daily-trend?${params}`);
  }
}

export default new ApiService();
