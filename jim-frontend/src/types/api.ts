export interface PaginatedResponse<T> {
  success: boolean;
  logs: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
} 