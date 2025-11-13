export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:8000';

export const API_ROUTES = {
  HEALTH: `${BACKEND_URL}/health`,
  BOOKS_LIST: `${BACKEND_URL}/books/list`,
  CREATE_BOOK: `${BACKEND_URL}/books/generate`,
  projectStatus: (projectId: string) => `${BACKEND_URL}/books/${projectId}/status`,
  cancelProject: (projectId: string) => `${BACKEND_URL}/books/${projectId}`,
  viewBook: (projectId: string) => `${BACKEND_URL}/books/${projectId}/view`,
  downloadBook: (projectId: string, format: string) =>
    `${BACKEND_URL}/books/${projectId}/download/${format}`,
};

