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

export default function ProjectDetailPage(props: ProjectDetailPageProps) {
  return <ProjectDetailClient params={props.params} />;
}
