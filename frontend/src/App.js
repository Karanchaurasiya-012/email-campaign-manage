import React, { useState, useEffect } from "react";
import CampaignList from "./components/CampaignList";

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipients: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("http://localhost:5000/campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Fetch campaigns error:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setCampaigns(data.campaigns);
      setFormData({ title: "", message: "", recipients: "" });
    } catch (error) {
      console.error("Create campaign error:", error);
    }
  };

  // Delete campaign handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/campaigns/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error("Delete campaign error:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ color: "#4CAF50" }}>📧 Email Campaign Manager</h1>

      {/* Campaign Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Campaign Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          name="message"
          placeholder="Campaign Message"
          value={formData.message}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          name="recipients"
          placeholder="Recipients (comma separated)"
          value={formData.recipients}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Campaign
        </button>
      </form>

      {/* Campaign List Component */}
      <CampaignList campaigns={campaigns} onDelete={handleDelete} />
    </div>
  );
}

export default App;
