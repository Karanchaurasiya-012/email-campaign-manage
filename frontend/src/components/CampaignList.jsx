import React from "react";

export default function CampaignList({ campaigns, onDelete }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Campaign List</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Recipients</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.title}</td>
              <td className="border p-2">{c.recipients}</td>
              <td className="border p-2">{c.message}</td>
              <td
                className={`border p-2 font-semibold ${
                  c.status === "sent"
                    ? "text-green-600"
                    : c.status === "failed"
                    ? "text-red-600"
                    : "text-yellow-600 blinking-text"
                }`}
              >
                {c.status || "pending"}
              </td>
              <td className="border p-2">
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => onDelete(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
