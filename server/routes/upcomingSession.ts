import express, { Request, Response } from "express";
import UpcomingSession from "../models/UpcomingSession";

const router = express.Router();

// GET upcoming session
router.get("/", async (_req: Request, res: Response) => {
  try {
    const session = await UpcomingSession.findOne({
      order: [["scheduled_at", "ASC"]],
    });
    res.json(session || {});
  } catch (err) {
    console.error("GET upcoming-session error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new session (replaces existing)
router.post("/", async (req: Request, res: Response) => {
  const { title, speaker, scheduled_at } = req.body;

  try {
    await UpcomingSession.destroy({ where: {} }); // clear old
    const session = await UpcomingSession.create({
      title,
      speaker,
      scheduled_at,
    });
    res.json(session);
  } catch (err) {
    console.error("POST upcoming-session error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// PUT: update session by ID
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, speaker, scheduled_at } = req.body;

  try {
    const updated = await UpcomingSession.update(
      { title, speaker, scheduled_at },
      { where: { id } }
    );
    res.json({ updated });
  } catch (err) {
    console.error("PUT upcoming-session error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});


export default router;
