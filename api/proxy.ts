const deployedUrl =
  "https://script.google.com/macros/s/AKfycbzyclRmJ9UWEPjWa5Yspe_5J8fOhwKDwszpm2jBLyrdM5M8RBxEgI8shqtW2z-WU7KPgA/exec";

// api/proxy.js

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch(deployedUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"],
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : null,
    });

    const data = await response.text();

    // Add the CORS header so your React app can access the response.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
