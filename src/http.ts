export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const RETRYABLE_CODES = new Set(['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN']);
const RETRYABLE_ERROR_NAMES = new Set(['TimeoutError', 'AbortError']);

export const isRetryableError = (error: unknown): boolean => {
  const name = (error as { name?: string })?.name;

  if (name !== undefined && RETRYABLE_ERROR_NAMES.has(name)) return true;

  const cause = (error as { cause?: { code?: string } })?.cause;

  return cause?.code !== undefined && RETRYABLE_CODES.has(cause.code);
};

export type RetryOptions = {
  maxRetries?: number;
  onRetry?: (attempt: number, backoffMs: number, error: unknown) => void;
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  { maxRetries = 5, onRetry }: RetryOptions = {},
): Promise<T> => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxRetries || !isRetryableError(error)) throw error;
      const backoffMs = 2 ** attempt * 1000;
      onRetry?.(attempt + 1, backoffMs, error);
      await sleep(backoffMs);
    }
  }
};
