
import { useState } from "react";
import "./styles/app.css";
import ProgressCircle from "./components/ProgressCircle";
import StatsCards from "./components/StatsCards";
import SearchBox from "./components/SearchBox";

const API_BASE = import.meta.env.VITE_API_URL || "";

function App() {
  const [lcUsername, setLcUsername] = useState("");
  const [cfUsername, setCfUsername] = useState("");
  const [lcStats, setLcStats] = useState(null);
  const [cfStats, setCfStats] = useState(null);
  const [cfContestHistory, setCfContestHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeetCodeStats = async () => {
    const query = {
      query: `
        query getUserData($username: String!) {
          allQuestionsCount { difficulty count }
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum { difficulty count }
              totalSubmissionNum { difficulty submissions }
            }
          }
          userContestRanking(username: $username) {
            rating attendedContestsCount globalRanking topPercentage
          }
        }
      `,
      variables: { username: lcUsername },
    };

    try {
      const res = await fetch(`${API_BASE}/leetcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`LeetCode API failed: ${res.status} ${text}`);
      }

      const data = await res.json();

      if (!data.data?.matchedUser) throw new Error("LeetCode user not found");

      setLcStats(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch LeetCode stats");
      setLcStats(null);
    }
  };

 
  const fetchCodeforcesStats = async () => {
    try {
      
      const res = await fetch(
        `${API_BASE}/codeforces?user=${encodeURIComponent(cfUsername)}`
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Codeforces API failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      if (data.status !== "OK") throw new Error("Codeforces user not found");

      setCfStats(data.result[0]);

      
      const contestRes = await fetch(
        `${API_BASE}/codeforces/contests?user=${encodeURIComponent(
          cfUsername
        )}`
      );
      const contestData = await contestRes.json();
      setCfContestHistory(
        contestData.status === "OK" ? contestData.result : []
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch Codeforces stats");
      setCfStats(null);
      setCfContestHistory([]);
    }
  };

  
  const handleSearch = async () => {
    if (!lcUsername && !cfUsername) {
      alert("Enter at least one username");
      return;
    }

    setLoading(true);
    setError("");

    if (lcUsername) await fetchLeetCodeStats();
    if (cfUsername) await fetchCodeforcesStats();

    setLoading(false);
  };

  
  return (
    <div className="container">
      <h1 className="title">StatsMetric</h1>

      <SearchBox
        lcUsername={lcUsername}
        setLcUsername={setLcUsername}
        cfUsername={cfUsername}
        setCfUsername={setCfUsername}
        handleSearch={handleSearch}
        loading={loading}
      />

      {error && <p className="error">{error}</p>}

      {(lcStats || cfStats) && (
        <div className="stats-sections">
          {/* leetcode  */}
          {lcStats && (
            <div className="stats-section">
              <h2 className="section-title">LeetCode Stats</h2>

             
              <div className="progress-row">
                <ProgressCircle
                  label="Easy"
                  solved={
                    lcStats.matchedUser.submitStats.acSubmissionNum[1].count
                  }
                  total={lcStats.allQuestionsCount[1].count}
                />
                <ProgressCircle
                  label="Medium"
                  solved={
                    lcStats.matchedUser.submitStats.acSubmissionNum[2].count
                  }
                  total={lcStats.allQuestionsCount[2].count}
                />
                <ProgressCircle
                  label="Hard"
                  solved={
                    lcStats.matchedUser.submitStats.acSubmissionNum[3].count
                  }
                  total={lcStats.allQuestionsCount[3].count}
                />
              </div>

              <StatsCards
                data={[
                  {
                    label: "All Submissions",
                    value:
                      lcStats.matchedUser.submitStats.totalSubmissionNum[0]
                        .submissions,
                  },
                  {
                    label: "Easy Submissions",
                    value:
                      lcStats.matchedUser.submitStats.totalSubmissionNum[1]
                        .submissions,
                  },
                  {
                    label: "Medium Submissions",
                    value:
                      lcStats.matchedUser.submitStats.totalSubmissionNum[2]
                        .submissions,
                  },
                  {
                    label: "Hard Submissions",
                    value:
                      lcStats.matchedUser.submitStats.totalSubmissionNum[3]
                        .submissions,
                  },
                ]}
              />

              {lcStats.userContestRanking && (
                <div className="contest-box">
                  <h3>LeetCode Contests</h3>
                  <p>
                    <strong>Rating:</strong>{" "}
                    {lcStats.userContestRanking.rating}
                  </p>
                  <p>
                    <strong>Contests Attended:</strong>{" "}
                    {lcStats.userContestRanking.attendedContestsCount}
                  </p>
                  <p>
                    <strong>Global Rank:</strong>{" "}
                    {lcStats.userContestRanking.globalRanking}
                  </p>
                  <p>
                    <strong>Top %:</strong>{" "}
                    {lcStats.userContestRanking.topPercentage?.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          )}

  {/*  codeforces  */}
          {cfStats && (
            <div className="stats-section">
              <h2 className="section-title">Codeforces Stats</h2>
              <div className="contest-box">
                <p>
                  <strong>Handle:</strong> {cfStats.handle}
                </p>
                <p>
                  <strong>Rating:</strong> {cfStats.rating ?? "Unrated"}
                </p>
                <p>
                  <strong>Max Rating:</strong> {cfStats.maxRating ?? "Unrated"}
                </p>
                <p>
                  <strong>Rank:</strong> {cfStats.rank}
                </p>
                <p>
                  <strong>Max Rank:</strong> {cfStats.maxRank}
                </p>
                <p>
                  <strong>Contests Participated:</strong>{" "}
                  {cfContestHistory.length}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
