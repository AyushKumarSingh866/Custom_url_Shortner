const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 5006;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB connected")
);

app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortID", async (req, res) => {
  try {
    const shortID = req.params.shortID; 
    const entry = await URL.findOneAndUpdate(
      { shortId: shortID }, 
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(), 
          },
        },
      },
      { new: true } // Returns updated document
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" }); 
    }

    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error in URL redirection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server started at PORT: ${PORT}`));
