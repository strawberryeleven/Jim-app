interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

export const handleApiError = async (response: Response) => {
  const data = await response.json() as ErrorResponse;
  throw new Error(data.error || 'An error occurred');
}; 