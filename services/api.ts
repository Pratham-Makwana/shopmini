import axios, { AxiosError } from "axios";

// Base URL for all API calls
const API_BASE_URL = "https://dummyjson.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types for API responses
export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Authentication service
 * Handles login functionality with dummyjson API
 */
export const authService = {
  /**
   * Login with username and password
   * @param username - User's username
   * @param password - User's password
   * @returns AuthResponse with user data and tokens
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        username,
        password,
        expiresInMins: 60, // Token expires in 60 minutes
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Invalid credentials";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  },
};

/**
 * Products service
 * Handles fetching product data
 */
export const productsService = {
  /**
   * Get all products
   * @returns ProductsResponse with array of products
   */
  getAll: async (): Promise<ProductsResponse> => {
    try {
      const response = await api.get<ProductsResponse>("/products");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch products");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Product data
   */
  getById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch product");
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Search products by query
   * @param query - Search query string
   * @returns ProductsResponse with matching products
   */
  search: async (query: string): Promise<ProductsResponse> => {
    try {
      const response = await api.get<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to search products");
      }
      throw new Error("An unexpected error occurred");
    }
  },
};

export default api;
