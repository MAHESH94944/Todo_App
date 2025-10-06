const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    credentials: "include", // send cookies
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export const auth = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me", { method: "GET" }).catch(() => null),
};

export const todos = {
  list: () => request("/todos", { method: "GET" }),
  get: (id) => request(`/todos/${id}`, { method: "GET" }),
  create: (payload) =>
    request(`/todos`, { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/todos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/todos/${id}`, { method: "DELETE" }),
};

export default { auth, todos };
