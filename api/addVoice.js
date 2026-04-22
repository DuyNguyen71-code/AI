export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY
    },
    body: req
  });

  const data = await response.json();
  res.status(200).json(data);
}
