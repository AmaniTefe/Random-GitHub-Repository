import { useState } from "react";
import languages from "./languages.json";

function App() {
  const [language, setLanguage] = useState("");
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRandomRepo = async () => {
    setLoading(true);
    setError("");
    setRepo(null);

    try {
      const query = language ? `language:${language}` : "";
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&page=${randomPage}&per_page=30`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.items.length);
        setRepo(data.items[randomIndex]);
      } else {
        setError("No repositories found.");
      }
    } catch {
      setError("Failed to fetch repository.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center", // vertical center
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          padding: "2rem",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <h1>GitHub Random Repository</h1>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem", width: "80%" }}
        >
          {languages.map((lang) => (
            <option key={lang.title} value={lang.value}>
              {lang.title}
            </option>
          ))}
        </select>

        <br />
        <br />

        <button
          onClick={fetchRandomRepo}
          disabled={loading || (language === "" && repo === null)}
          style={{
            padding: "0.6rem 1.2rem",
            fontSize: "1rem",
            backgroundColor: "#2c974b",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : repo ? "Refresh" : "Find Repository"}
        </button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        {repo && (
          <div
            style={{
              textAlign: "left",
              marginTop: "2rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <h2>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h2>
            <p>{repo.description}</p>
            <p>
              <strong>⭐ Stars:</strong> {repo.stargazers_count}
            </p>
            <p>
              <strong>🍴 Forks:</strong> {repo.forks_count}
            </p>
            <p>
              <strong>🐞 Open Issues:</strong> {repo.open_issues_count}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
