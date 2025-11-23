import { useState, useEffect } from "react";
import axios from "axios";
import LinkForm from "./LinkForm";
import "../Dashboard.css";

function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get("https://tinylink-backend-zchq.onrender.com/api/links");
      setLinks(res.data);
    } catch (error) {
      console.error("Error loading links", error);
    }
    setLoading(false);
  };

  // ✅ FIXED DELETE FUNCTION
  const deleteLink = async (code) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await axios.delete(`https://tinylink-backend-zchq.onrender.com/api/links/${code}`);
      fetchLinks();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete the link");
    }
  };

if (loading)
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loader-text">Wait for a second...</p>
    </div>
  );



  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">TinyLink Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Manage all your short URLs in one place
        </p>
      </div>

      {/* Create Link Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="submit-btn rounded hover:bg-blue-700 transition mb-6"
      >
        {showForm ? "Close Form" : "Create Short Link"}
      </button>

      {/* Link Creation Form */}
      {showForm && (
        <div className="mb-12">
          <LinkForm onAdd={fetchLinks} />
        </div>
      )}

      {/* Table Header */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Your Short Links
      </h2>

      {/* Table */}
      <div className="bg-white p-4 border rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">URL</th>
              <th className="p-4 text-center">Clicks</th>
              <th className="p-4 text-center">Last Click</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => (
              <tr
                key={link.code}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-semibold text-gray-900">{link.code}</td>

                <td className="p-4 max-w-[280px] truncate text-blue-600">
                  {link.url}
                </td>

                <td className="p-4 text-center">{link.clicks}</td>

                <td className="p-4 text-right">
                  {link.last_clicked ? link.last_clicked.replace("T", " ").split(".")[0] : "Never"}
                </td>

                <td className="p-4 flex justify-center gap-2">
                  {/* Copy Button */}
                  <button
                    className="bg-green-500 px-3 py-1 text-white rounded-lg hover:bg-green-600 transition shadow-sm"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${link.code}`
                      )
                    }
                  >
                    Copy
                  </button>

                  {/* Stats Page */}
                  <button
                    className="bg-blue-500 px-3 py-1 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
                    onClick={() =>
                      (window.location.href = `/stats/${link.code}`)
                    }
                  >
                    Stats
                  </button>
                  <button
                    className="bg-purple-500 px-3 py-1 text-black rounded-lg hover:bg-purple-600 transition shadow-sm"
                    onClick={() =>
                      window.open(
                        `http://localhost:3001/${link.code}`,
                        "_blank"
                      )
                    }
                  >
                    Visit
                  </button>

                  {/* Delete Button */}
                  <button
                    className="bg-red-500 px-3 py-1 text-white rounded-lg hover:bg-red-600 transition shadow-sm"
                    onClick={() => deleteLink(link.code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty Message */}
      {links.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No links yet. Create one above!
        </p>
      )}
    </div>
  );
}

export default Dashboard;

