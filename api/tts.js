export default async function handler(req, res) {
  try {
    const text = req.body?.text;

    if (!text) {
      return res.status(400).send("Thiếu text");
    }

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).send("Không lấy được audio");
    }

    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(Buffer.from(audioBuffer));

  } catch (err) {
    res.status(500).send(err.message);
  }
}
