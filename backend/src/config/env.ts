import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  REMNA_API_URL: z.preprocess(
    (s) => {
      if (typeof s !== "string") return s;
      const t = s.trim();
      if (t === "") return undefined;
      // Допускаем hostname без протокола — дополняем https://
      if (!/^https?:\/\//i.test(t)) return `https://${t}`;
      return t;
    },
    z.string().url().optional()
  ),
  REMNA_ADMIN_TOKEN: z.string().optional(),
  CORS_ORIGIN: z.string().default("*"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
