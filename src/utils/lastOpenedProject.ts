const LAST_OPENED_PROJECT_KEY = "lastOpenedProjectId";

export function rememberLastOpenedProject(projectId: number) {
  localStorage.setItem(LAST_OPENED_PROJECT_KEY, String(projectId));
}

export function getLastOpenedProjectId() {
  return Number(localStorage.getItem(LAST_OPENED_PROJECT_KEY));
}
