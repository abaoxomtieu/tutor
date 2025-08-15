import { Scenario, Message } from "@/types";

// const API_BASE_URL = "http://0.0.0.0:8000";
const API_BASE_URL = "https://abao77-run-code-api.hf.space";

// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export { generateUUID };

export async function fetchScenarios(): Promise<Scenario[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/scenarios`);

  if (!response.ok) {
    throw new Error("Failed to fetch scenarios");
  }

  return response.json();
}

export async function sendMessage(
  query: string,
  sessionId: string,
  scenario: Scenario | null
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/roleplay`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      session_id: sessionId,
      scenario,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/get-messages`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get messages");
  }

  const data = await response.json();

  // Convert API response format to our Message format
  return data.messages.map((msg: any) => ({
    role:
      msg.role === "human"
        ? "user"
        : msg.role === "ai"
        ? "assistant"
        : msg.role,
    content: msg.content,
  }));
}

// Session Management APIs
export interface Session {
  id: string;
  name: string;
  created_at: string;
  last_message?: string;
  message_count: number;
}

export async function getSessions(): Promise<Session[]> {
  const response = await fetch(`${API_BASE_URL}/api/ai/sessions`);

  if (!response.ok) {
    throw new Error("Failed to get sessions");
  }

  const data = await response.json();
  return data.sessions;
}

export async function createSession(name: string): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/api/ai/sessions`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  const data = await response.json();
  return data.session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/ai/sessions/${sessionId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete session");
  }
}

export async function updateSession(sessionId: string, name: string): Promise<Session> {
  const response = await fetch(`${API_BASE_URL}/api/ai/sessions/${sessionId}`, {
    method: "PUT",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update session");
  }

  const data = await response.json();
  return data.session;
}
