import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostFormCard from "@/components/PostFormCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useEffect, useState } from "react";
import { post } from "@/types/post";
import TimeAgo from "javascript-time-ago";
// The desired locale.
import en from "javascript-time-ago/locale/en";
// Initialize the desired locale.
TimeAgo.addDefaultLocale(en);

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [posts, setPosts] = useState<post[] | null>(null);

  //postsテーブルから投稿を取得
  useEffect(() => {
    supabase
      .from("posts")
      .select("id, content, created_at, profiles(id,name,avatar)")
      .order("created_at", { ascending: false })
      .then((result) => {
        console.log(result.data);
        if (result.data?.length) {
          setPosts(result.data as post[]);
        }
      });
  }, [supabase]);

  // If the user is not logged in, show the login page
  if (!session) {
    return <LoginPage />;
  }
  return (
    <Layout>
      <PostFormCard />
      {posts?.length &&
        posts?.map((post) => <PostCard key={post.id} post={post} />)}
    </Layout>
  );
}
