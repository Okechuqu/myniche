import { z } from "zod";

export const scriptSchema = z.object({
  niche: z.string().min(2, "Niche is required"),
  platform: z.string().min(2, "Platform is required"),
  topic: z.string().min(2, "Topic is required"),
  tone: z.string().min(2, "Tone is required"),
});

export type ScriptInput = z.infer<typeof scriptSchema>;
