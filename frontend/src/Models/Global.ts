export interface ApiResponse<T> {
  code: number;
  result: T;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
