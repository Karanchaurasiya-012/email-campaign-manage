const http = require("http");
const nodemailer = require("nodemailer");

const campaigns = [];

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "" 
  }
});

const server = http.createServer((req, res) => {
  // CORS enable
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Get all campaigns
  if (req.method === "GET" && req.url === "/campaigns") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(campaigns));
  }

  // Create new campaign + send email
  else if (req.method === "POST" && req.url === "/campaigns") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const newCampaign = JSON.parse(body);

      // Assign unique id (timestamp)
      newCampaign.id = Date.now();

      // Initial status pending
      newCampaign.status = "pending";
      campaigns.push(newCampaign);

      const recipientList = newCampaign.recipients.split(",").map(e => e.trim());

      try {
        await transporter.sendMail({
          from: '"Campaign Manager" <karanchaurasiya.012@gmail.com>',
          to: recipientList,
          subject: newCampaign.title,
          text: newCampaign.message
        });

        // Email sent successfully
        newCampaign.status = "sent";
        console.log("✅ Emails sent successfully");
      } catch (error) {
        newCampaign.status = "failed";
        console.error("❌ Email send error:", error);
      }

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Campaign processed", campaigns }));
    });
  }

  // Delete campaign by id
  else if (req.method === "DELETE" && req.url.startsWith("/campaigns/")) {
    const id = req.url.split("/")[2];
    const index = campaigns.findIndex(c => c.id == id);

    if (index !== -1) {
      campaigns.splice(index, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Campaign deleted", campaigns }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Campaign not found" }));
    }
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
