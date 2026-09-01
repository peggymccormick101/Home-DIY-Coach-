const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export function listProjects() {
  return request("/projects");
}

export function getProject(id) {
  return request(`/projects/${id}`);
}

export function createProject(data) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function askQuestion(id, question) {
  return request(`/projects/${id}/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function deleteProject(id) {
  return request(`/projects/${id}`, { method: "DELETE" });
}
