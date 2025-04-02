// api/proxy.js

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  try {
    // Always use POST when forwarding to the Apps Script endpoint
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzyclRmJ9UWEPjWa5Yspe_5J8fOhwKDwszpm2jBLyrdM5M8RBxEgI8shqtW2z-WU7KPgA/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.text();

    // Add CORS header for the client
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
  