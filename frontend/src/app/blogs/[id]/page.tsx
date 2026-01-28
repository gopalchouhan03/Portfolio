import { blogsData } from '@/lib/blogs';
import { BlogDetailClient } from './client';

export async function generateStaticParams() {
  return blogsData.map((blog) => ({
    id: blog.id.toString(),
  }));
}

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogDetailPage(props: BlogDetailPageProps) {
  return <BlogDetailClient params={props.params} />;
}
