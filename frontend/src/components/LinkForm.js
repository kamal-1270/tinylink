import { useState } from "react";
import axios from "axios";
import "../Linkform.css";

function LinkForm({ onAdd }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({});

    try {
      await axios.post("http://localhost:3001/api/links", { url, code });
      setMessage({ type: "success", text: "Link Created Successfully!" });
      setUrl("");
      setCode("");

      if (onAdd) onAdd();
    }  catch (err) {
  console.log("ERROR:", err.response?.data);

  setMessage({
    type: "error",
    text:
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong",
  });
}

  };

  return (
    <div className="link-card">
      <h2>Create Short Link</h2>

      <form onSubmit={handleSubmit} className="link-form">

        <div>
          <label>Enter URL</label>
          <input
            type="url"
            className="link-input"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Custom Code (optional)</label>
          <input
            type="text"
            className="link-input"
            placeholder="my-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Shorten URL
        </button>
      </form>

      {message.text && (
        <p className={`message ${message.type}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

export default LinkForm;
