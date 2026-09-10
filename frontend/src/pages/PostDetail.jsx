import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getPostById } from "../api/posts";
import { toast } from "sonner";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Xato", err);
        toast.error("Xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Post topilmadi</p>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        ← Orqaga
      </Link>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-64 bg-linear-to-r from-slate-400 to-slate-600 flex items-center justify-center text-white text-6xl"></div>
        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-slate-300 to-slate-500 flex items-center justify-center text-white font-bold">
              {post.author?.ism?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author?.ism}</p>
              <p className="text-sm text-gray-500">{post.author?.email}</p>
            </div>
          </div>
          <div className="mt-8 text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostDetail;
