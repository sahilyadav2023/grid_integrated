import { Request, Response } from "express";

let currentVideoURL = "https://www.youtube.com/embed/default_live_url"; // default

export const getLiveVideoURL = (req: Request, res: Response): void => {
  res.json({ videoURL: currentVideoURL });
};

export const setLiveVideoURL = (req: Request, res: Response): void => {
  const { videoURL } = req.body;
  currentVideoURL = videoURL;
  res.json({ success: true, videoURL });
};
