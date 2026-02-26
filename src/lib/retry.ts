import { createLogger } from "./logger";

const log = createLogger({ service: "retry" });

interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === opts.maxAttempts) break;

      const delay = Math.min(
        opts.baseDelayMs * Math.pow(2, attempt - 1),
        opts.maxDelayMs
      );
      const jitter = delay * (0.5 + Math.random() * 0.5);

      log.warn(
        { attempt, maxAttempts: opts.maxAttempts, delayMs: Math.round(jitter) },
        "Retrying after failure"
      );

      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }

  throw lastError;
}
