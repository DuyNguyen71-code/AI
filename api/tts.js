export default async function handler(req, res) {
  try {
    let rawBody = "";

    await new Promise((resolve, reject) => {
      req.on("data", chunk => {
        rawBody += chunk;
      });

      req.on("end", resolve);
      req.on("error", reject);
    });

    const body = JSON.parse(rawBody || "{}");
    const text = body.text;

    if (!text) {
      return res.status(400).send("Thiếu text");
    }

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).send(err);
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(audioBuffer));

  } catch (err) {
    res.status(500).send(err.message);
  }
}
