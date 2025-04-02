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

  // Manually parse the request body
  let rawBody = "";
  try {
    rawBody = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        resolve(data);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });
  } catch (err) {
    res.status(400).json({ error: "Error reading request body" });
    return;
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch (err) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  // Forward the request to your Apps Script endpoint
  const deployedUrl =
    "https://script.google.com/macros/s/AKfycbzyclRmJ9UWEPjWa5Yspe_5J8fOhwKDwszpm2jBLyrdM5M8RBxEgI8shqtW2z-WU7KPgA/exec";

  try {
    const response = await fetch(deployedUrl, {
      method: "POST", // Always use POST for the upload
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedBody),
    });

    const data = await response.text();

    // Pass along the CORS header
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
  