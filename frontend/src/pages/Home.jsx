import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getTalabalar } from "../api/talabalar";
import { getPosts } from "../api/posts";
import { toast } from "sonner";
import AddTalabaDialog from "../components/AddTalabaDialog";
import AddPostDialog from "../components/AddPostDialog";

function Home() {
  const [talabalar, setTalabalar] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [talabaData, postData] = await Promise.all([
        getTalabalar(),
        getPosts(),
      ]);
      setTalabalar(talabaData);
      setPosts(postData);
    } catch (err) {
      console.error("Xato", err);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="text-center py-12 bg-linear-to-r from-slate-500 to-slate-700 rounded-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Bilimlar platformasi
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Talabalar va ularning postlari bilan tanishing
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-500 rounded-3xl"></div>{" "}
                Talabalar
              </h2>
              <AddTalabaDialog onSuccess={loadData} />
            </div>
            <div className="space-y-4">
              {talabalar.length === 0 ? (
                <p className="text-gray-500">Talabalar yo'q</p>
              ) : (
                talabalar.map((talaba) => (
                  <Link
                    key={talaba.id}
                    to={`/talaba/${talaba.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition group"
                  >
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {talaba.ism.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition truncate">
                        {talaba.ism}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {talaba.email}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-500 rounded-3xl"></div> So'nggi
              postlar
            </h2>
            <AddPostDialog talabalar={talabalar} onSuccess={loadData} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.length === 0 ? (
              <p className="text-gray-500">Postlar yo'q</p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="h-40 bg-linear-to-r from-slate-300 to-slate-500 flex items-center justify-center" />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {post.author?.ism?.charAt(0).toUpperCase() || "?"}
                      </span>
                      <span>{post.author?.ism || "Noma’lum"}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
