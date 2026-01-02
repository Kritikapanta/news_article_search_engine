// This will be our frontend interface to the backend API
export const searchNews = async (query) => {
  try {
    // This will call your Python backend API
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search error:', error);
    return { results: [], error: 'Failed to fetch results' };
  }
};