import React, { useState } from "react";
import HomePage from "./pages/HomePage";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (q, page = 1) => {
    setQuery(q);
    try {
      const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(q)}&page=${page}`);
      const data = await res.json();
      setResults(data.results);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setSearchPerformed(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setSearchPerformed(false);
    setCurrentPage(1);
    setTotalPages(1);
  };

  return (
    <HomePage
      searchQuery={query}
      searchResults={results}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      searchPerformed={searchPerformed}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}

export default App;
