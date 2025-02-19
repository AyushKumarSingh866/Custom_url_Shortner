const shortid = require("shortid");
const URL = require("../models/url");

async function handlegenerateNewShortURL(req, res) {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const shortId = shortid.generate(); // Fix: Use `generate()`
    
    await URL.create({
        shortId: shortId,
        redirectURL: url,
        visitHistory: [],
    });

    return res.json({ id: shortId });
}

async function handleGetAnalytics(req, res) {  // Fix: Corrected (req, res) order
    try {
        const { shortId } = req.params;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    handlegenerateNewShortURL,
    handleGetAnalytics,
};
