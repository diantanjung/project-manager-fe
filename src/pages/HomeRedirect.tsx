import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { PageLoading } from "../components/shared/Loading";
import { projectService } from "../services/project.service";
import { getLastOpenedProjectId } from "../utils/lastOpenedProject";

export function HomeRedirect() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function resolveTarget() {
      try {
        const projects = await projectService.getSidebarProjects();
        const lastProjectId = getLastOpenedProjectId();
        const lastProject = projects.find((project) => project.id === lastProjectId);
        const project = lastProject ?? projects[0];

        if (isMounted) {
          setTarget(project ? `/project/${project.id}` : "/dashboard");
        }
      } catch {
        if (isMounted) {
          setTarget("/dashboard");
        }
      }
    }

    resolveTarget();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!target) {
    return <PageLoading label="Opening workspace..." />;
  }

  return <Navigate to={target} replace />;
}
