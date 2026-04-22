import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Chỉ hỗ trợ POST" });
  }

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });

    const filePath = files.file[0].filepath;
    const buffer = fs.readFileSync(filePath);

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
        method: "POST",
        headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
        body: buffer,
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(500).send(error);
      }

      const data = await response.json();
      res.status(200).json({ voice_id: data.voice_id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
