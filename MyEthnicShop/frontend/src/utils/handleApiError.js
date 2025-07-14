// Utility to extract a user-friendly error message from an Axios error
export default function handleApiError(error, fallback = 'Something went wrong') {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
} 