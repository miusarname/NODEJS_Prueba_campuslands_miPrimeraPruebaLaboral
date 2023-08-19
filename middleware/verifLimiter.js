import { Router } from "express";
export const verifLimiter = Router();

verifLimiter.use("/", async (req, res, next) => {
  if (!req.rateLimit) return;
  console.log(req.rateLimit);
  next();
});
