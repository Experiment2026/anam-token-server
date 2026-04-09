import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

// Replace this with your GitHub Pages URL later
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(
  cors({
    origin: allowedOrigin,
  })
);

app.get("/", (req, res) => {
  res.send("Anam token server is running.");
});

app.post("/api/session-token", async (req, res) => {
  try {
    const response = await fetch("https://anam-token-server-1.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ANAM_API_KEY}`,
      },
      body: JSON.stringify({
        personaConfig: {
          name: process.env.PERSONA_NAME || "Study Agent",
          avatarId: process.env.ANAM_AVATAR_ID,
          voiceId: process.env.ANAM_VOICE_ID,
          llmId: process.env.ANAM_LLM_ID,
          systemPrompt: process.env.ANAM_SYSTEM_PROMPT || "Respond helpfully."
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({
      sessionToken: data.sessionToken
    });
  } catch (error) {
    console.error("Session token error:", error);
    res.status(500).json({ error: "Failed to create session token." });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
