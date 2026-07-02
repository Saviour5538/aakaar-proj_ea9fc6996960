import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AIQueryRequest {
  query: string;
  session_id: string;
  user_id: string;
}

export interface AIQueryResponse {
  answer: string;
  sources: string[];
}

export interface IngestDocumentsRequest {
  file: File;
  session_id: string;
  user_id: string;
}

export interface IngestDocumentsResponse {
  success: boolean;
  message: string;
}

export interface Document {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export interface ListDocumentsResponse {
  documents: Document[];
}

export const ingestDocuments = async (data: IngestDocumentsRequest): Promise<IngestDocumentsResponse> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('session_id', data.session_id);
  formData.append('user_id', data.user_id);

  try {
    const response = await api.post<IngestDocumentsResponse>('/api/ai/ingest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload document');
  }
};

export const aiQuery = async (data: AIQueryRequest): Promise<AIQueryResponse> => {
  try {
    const response = await api.post<AIQueryResponse>('/api/ai/query', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch query response');
  }
};

export const listDocuments = async (): Promise<ListDocumentsResponse> => {
  try {
    const response = await api.get<ListDocumentsResponse>('/api/documents');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};