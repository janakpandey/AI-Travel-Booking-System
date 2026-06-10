export interface Results {
  flight_results: string;
  hotel_results: string;
  itinerary: string;
  final_response: string;
  llm_calls: number;
}

export interface SSEEvent {
  agent: string;
  label?: string;
  data?: string;
  llm_calls?: number;
}

const rawUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_BASE = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

export async function* streamPlan(
  query: string,
  threadId: string = "web_user"
): AsyncGenerator<SSEEvent> {
  const response = await fetch(`${API_BASE}/api/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, thread_id: threadId }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const event: SSEEvent = JSON.parse(line.slice(6));
          yield event;
        } catch {
          // skip malformed events
        }
      }
    }
  }
}
