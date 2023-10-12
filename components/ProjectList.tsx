import { type DashProject } from "$utils/dash.ts";

import { Project } from "./Project.tsx";

export function ProjectList({ projects }: { projects: DashProject[] }) {
  if (!projects.length) {
    return null;
  }
  return (
    <>
      <h1 class="text-xl font-bold py-2">Projects</h1>
      <ul class="space-y-2">
        {projects.map((project) => <Project project={project} />)}
      </ul>
    </>
  );
}
