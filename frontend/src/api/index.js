const API_BASE = "http://localhost:8000"; // your FastAPI backend

export async function fetchTransactions(token) {
  const res = await fetch(`${API_BASE}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return await res.json();
}

export async function addTransaction(data, token) {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add transaction");
  return await res.json();
}