interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = ONE_HOUR_MS;

class RateLimiter {
  private hourlyRequests: Map<string, RateLimitEntry> = new Map();
  private dailyRequests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    private hourlyLimit: number = 15,
    private dailyLimit: number = 105
  ) {
    this.cleanupInterval = setInterval(() => this.cleanup(), CLEANUP_INTERVAL_MS);
  }

  private getClientId(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || "unknown";
    return ip.trim();
  }

  private checkLimit(
    entry: RateLimitEntry | undefined,
    limit: number,
    windowMs: number,
    currentTime: number
  ): RateLimitResult {
    if (!entry) {
      return {
        allowed: true,
        remaining: limit,
        resetTime: currentTime + windowMs,
        limit,
      };
    }

    const isExpired = currentTime >= entry.resetTime;
    if (isExpired) {
      return {
        allowed: true,
        remaining: limit,
        resetTime: currentTime + windowMs,
        limit,
      };
    }

    const remaining = Math.max(0, limit - entry.count);
    const allowed = entry.count < limit;

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      limit,
    };
  }

  private updateOrCreateEntry(
    map: Map<string, RateLimitEntry>,
    clientId: string,
    windowMs: number,
    currentTime: number
  ): void {
    const entry = map.get(clientId);
    const isExpired = !entry || currentTime >= entry.resetTime;

    if (isExpired) {
      map.set(clientId, {
        count: 1,
        resetTime: currentTime + windowMs,
      });
    } else {
      entry.count++;
    }
  }

  checkRateLimit(request: Request): {
    hourly: RateLimitResult;
    daily: RateLimitResult;
  } {
    const clientId = this.getClientId(request);
    const currentTime = Date.now();

    const hourlyEntry = this.hourlyRequests.get(clientId);
    const dailyEntry = this.dailyRequests.get(clientId);

    const hourlyResult = this.checkLimit(
      hourlyEntry,
      this.hourlyLimit,
      ONE_HOUR_MS,
      currentTime
    );

    const dailyResult = this.checkLimit(
      dailyEntry,
      this.dailyLimit,
      ONE_DAY_MS,
      currentTime
    );

    if (hourlyEntry && currentTime >= hourlyEntry.resetTime) {
      this.hourlyRequests.delete(clientId);
    }

    if (dailyEntry && currentTime >= dailyEntry.resetTime) {
      this.dailyRequests.delete(clientId);
    }

    return {
      hourly: hourlyResult,
      daily: dailyResult,
    };
  }

  recordRequest(request: Request): void {
    const clientId = this.getClientId(request);
    const currentTime = Date.now();

    this.updateOrCreateEntry(
      this.hourlyRequests,
      clientId,
      ONE_HOUR_MS,
      currentTime
    );

    this.updateOrCreateEntry(
      this.dailyRequests,
      clientId,
      ONE_DAY_MS,
      currentTime
    );
  }

  private cleanup(): void {
    const currentTime = Date.now();

    for (const [clientId, entry] of this.hourlyRequests.entries()) {
      if (currentTime >= entry.resetTime) {
        this.hourlyRequests.delete(clientId);
      }
    }

    for (const [clientId, entry] of this.dailyRequests.entries()) {
      if (currentTime >= entry.resetTime) {
        this.dailyRequests.delete(clientId);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.hourlyRequests.clear();
    this.dailyRequests.clear();
  }
}

const rateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_HOURLY || "10", 10),
  parseInt(process.env.RATE_LIMIT_DAILY || "50", 10)
);

export function checkRateLimit(request: Request): {
  allowed: boolean;
  hourly: RateLimitResult;
  daily: RateLimitResult;
  error?: string;
} {
  const { hourly, daily } = rateLimiter.checkRateLimit(request);

  if (!hourly.allowed) {
    const resetTime = new Date(hourly.resetTime);
    return {
      allowed: false,
      hourly,
      daily,
      error: `Rate limit exceeded. Please try again after ${resetTime.toLocaleTimeString()}.`,
    };
  }

  if (!daily.allowed) {
    const resetTime = new Date(daily.resetTime);
    return {
      allowed: false,
      hourly,
      daily,
      error: `Daily rate limit exceeded. Please try again after ${resetTime.toLocaleDateString()}.`,
    };
  }

  rateLimiter.recordRequest(request);

  return {
    allowed: true,
    hourly,
    daily,
  };
}

