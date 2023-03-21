require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { Configuration, OpenAIApi } = require("openai");

// OpenAI APIキーを環境変数から取得（.envファイルに記載）
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generateProfile", async (req, res) => {
  const prompt =
    "Generate a random profile with id, name, age and bio in json format. End the text with double quotes.";
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 200,
    n: 1,
    stop: null,
    temperature: 0.8,
  });

  const profileData = response.data.choices[0].text.trim();
  res.send(profileData);
});

app.post("/generateReply", async (req, res) => {
  const response = await openai.createCompletion({
    // model: "gpt-3.5-turbo",
    model: "text-davinci-003",
    prompt: req.body.messages,
    max_tokens: 200,
    n: 1,
    stop: null,
    temperature: 0.8,
  });

  const profileData = response.data.choices[0].text.trim();
  res.send(profileData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
