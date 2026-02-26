export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRateMs: number;

  constructor(maxTokensPerHour: number) {
    this.maxTokens = maxTokensPerHour;
    this.tokens = maxTokensPerHour;
    this.lastRefill = Date.now();
    this.refillRateMs = (60 * 60 * 1000) / maxTokensPerHour;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const newTokens = Math.floor(elapsed / this.refillRateMs);
    if (newTokens > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
      this.lastRefill = now;
    }
  }

  async acquire(): Promise<void> {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return;
    }
    const waitMs = this.refillRateMs - (Date.now() - this.lastRefill);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    this.refill();
    this.tokens--;
  }

  get availableTokens(): number {
    this.refill();
    return this.tokens;
  }
}
