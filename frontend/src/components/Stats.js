import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Stats.css";

function Stats() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/api/links/${code}/stats`) // fetch stats without incrementing clicks
      .then((res) => {
        setLink(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLink(null);
        setLoading(false);
      });
  }, [code]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loader-text">Wait for a second...</p>
      </div>
    );

  if (!link) return <p className="error-text">Invalid Code</p>;

  return (
    <div className="stats-container">
      <div className="stats-card">
       <h2 className="stats-title">
  <span>Stats for :-</span>
  <small className="text-primary"> {code}</small>
</h2>



        <div className="stats-item">
          <div className="stats-label">URL:</div>
          <p className="stats-value">{link.url}</p>
        </div>

        <div className="stats-item">
          <div className="stats-label">Total Clicks:</div>
          <p className="stats-value">{link.clicks}</p>
        </div>

        <div className="stats-item">
          <div className="stats-label">Last Clicked:</div>
          <div className="stats-value">
            {link.last_clicked
              ? link.last_clicked.replace("T", " ").split(".")[0]
              : "Never"}
          </div>
        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Stats;
