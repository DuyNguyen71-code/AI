export default async function handler(req, res) {
  try {
    const text = req.body?.text;

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
      const error = await response.text();
      return res.status(500).send(error);
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(Buffer.from(audioBuffer));

  } catch (err) {
    return res.status(500).send(err.message);
  }
}
