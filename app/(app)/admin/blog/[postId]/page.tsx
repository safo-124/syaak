import { notFound } from "next/navigation";
import { getPostById } from "@/lib/blog";
import { BlogForm } from "@/components/admin/blog-form";

interface EditBlogPostPageProps {
  params: Promise<{ postId: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { postId } = await params;
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return <BlogForm post={post} />;
}
