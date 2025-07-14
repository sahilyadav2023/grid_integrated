import express, { Request, Response } from "express";
import Session from "../models/session";

const router = express.Router();

// Get latest session
router.get("/", async (req: Request, res: Response) => {
  try {
    const session = await Session.findOne({ order: [["startedAt", "DESC"]] });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest session" });
  }
});

// Start new live session
router.post("/start", async (req: Request, res: Response) => {
  const { title, videoUrl } = req.body;
  try {
    await Session.update({ isLive: false }, { where: { isLive: true } });
    const session = await Session.create({
      title,
      videoUrl,
      isLive: true,
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed to start session" });
  }
});

// Get currently live session
router.get("/live", async (req: Request, res: Response) => {
  try {
    const session = await Session.findOne({ where: { isLive: true } });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "No live session" });
  }
});

// Stop all sessions
router.post("/stop", async (req: Request, res: Response) => {
  try {
    await Session.update({ isLive: false }, { where: {} });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to stop sessions" });
  }
});

export default router;
