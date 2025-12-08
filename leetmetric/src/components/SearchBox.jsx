import React from "react";

export default function SearchBox({
  lcUsername,
  setLcUsername,
  cfUsername,
  setCfUsername,
  handleSearch,
  loading,
}) {
  return (
    <div className="search-page">
      <div className="search-image">
       
        <img src="/bg-photo.jpg" alt="LeetMetric Banner" />
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="LeetCode Username"
          value={lcUsername}
          onChange={(e) => setLcUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Codeforces Handle"
          value={cfUsername}
          onChange={(e) => setCfUsername(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}
