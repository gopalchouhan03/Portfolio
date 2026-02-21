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

export default async function BlogDetailPage(props: BlogDetailPageProps) {
  const { id } = await props.params;
  const blog = blogsData.find(b => b.id.toString() === id);

  return <BlogDetailClient blog={blog} />;}