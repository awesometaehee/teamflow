type ApiErrorPayload = {
  message?: string;
  details?: string[];
};

export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function postJson<TResponse, TBody>(
  url: string,
  body: TBody,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let payload: ApiErrorPayload | null = null;

    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = null;
    }

    throw new ApiError(
      response.status,
      payload?.message ?? "Request failed",
      payload?.details ?? [],
    );
  }

  return (await response.json()) as TResponse;
}
