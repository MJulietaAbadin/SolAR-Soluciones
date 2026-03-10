const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7077";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Error ${res.status}`);
  }

  return res.json();
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("solar_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
