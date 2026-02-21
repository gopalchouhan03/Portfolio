import { projectsData } from '@/lib/projects';
import { ProjectDetailClient } from './client';

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id.toString(),
  }));
}

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage(props: ProjectDetailPageProps) {
  const { id } = await props.params;
  const project = projectsData.find(p => p.id.toString() === id);

  return <ProjectDetailClient project={project} />;
}

