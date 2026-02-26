import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(process.env.NODE_ENV === "development" && {
    transport: { target: "pino/file" },
  }),
});

export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
