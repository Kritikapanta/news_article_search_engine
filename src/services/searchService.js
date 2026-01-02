export const searchNews = async (query) => {
  try {
    const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If there's an error from backend
    if (data.error) {
      console.error('Backend error:', data.error);
      return { results: [], query, error: data.error };
    }
    
    return data;
  } catch (error) {
    console.error('Search error:', error);
    
    // Fallback mock data for testing if backend is not running
    return {
      query,
      results: [
        {
          title: "Climate Change",
          url: "https://science.nasa.gov/climate-change",
          source: "NASA",
          date: "Sep 26, 2025",
          snippet: "There is unequivocal evidence that Earth is warming at an unprecedented rate. Human activity is the principal cause.",
          readTime: "2 min read",
          isGov: true,
          sections: ["Evidence", "Effects", "Climate Change Stories"]
        },
        {
          title: "Climate change impacts",
          url: "https://www.noaa.gov/education/resource-collections",
          source: "NOAA",
          date: "Recent",
          snippet: "Climate change impacts our society in many different ways. Drought can harm food production and human health.",
          readTime: "3 min read",
          isGov: true,
          sections: ["Education", "Resource Collections"]
        },
        {
          title: "Climate change and human health",
          url: "https://www.who.int/news-room/fact-sheets/detail/climate-change",
          source: "World Health Organization (WHO)",
          date: "Oct 12, 2023",
          snippet: "Climate change presents a fundamental threat to human health. It affects the physical environment...",
          readTime: "4 min read",
          isGov: false,
          sections: ["Newsroom", "Fact sheets"]
        }
      ],
      total: 3,
      error: "Using mock data. Backend might not be running."
    };
  }
};