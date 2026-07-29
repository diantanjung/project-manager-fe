import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeRedirect } from "./HomeRedirect";
import { projectService } from "../services/project.service";
import { rememberLastOpenedProject } from "../utils/lastOpenedProject";

vi.mock("../services/project.service", () => ({
  projectService: {
    getSidebarProjects: vi.fn(),
  },
}));

function renderHomeRedirect() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        <Route path="/project/:projectId" element={<div>Project Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("HomeRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("redirects to the last opened project when it is still visible", async () => {
    rememberLastOpenedProject(2);
    vi.mocked(projectService.getSidebarProjects).mockResolvedValueOnce([
      { id: 1, name: "Alpha", openTaskCount: 0 },
      { id: 2, name: "Beta", openTaskCount: 3 },
    ]);

    renderHomeRedirect();

    await waitFor(() => {
      expect(screen.getByText("Project Page")).toBeInTheDocument();
    });
  });

  it("redirects to the first visible project when no last opened project exists", async () => {
    vi.mocked(projectService.getSidebarProjects).mockResolvedValueOnce([
      { id: 5, name: "First", openTaskCount: 1 },
    ]);

    renderHomeRedirect();

    await waitFor(() => {
      expect(screen.getByText("Project Page")).toBeInTheDocument();
    });
  });

  it("redirects to dashboard when there are no visible projects", async () => {
    vi.mocked(projectService.getSidebarProjects).mockResolvedValueOnce([]);

    renderHomeRedirect();

    await waitFor(() => {
      expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    });
  });
});
