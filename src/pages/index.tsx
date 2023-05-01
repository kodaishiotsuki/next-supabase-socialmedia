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
import { profile } from "@/types/profile";
import { UserContext } from "@/contexts/UserContext";
// Initialize the desired locale.
TimeAgo.addDefaultLocale(en);

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [posts, setPosts] = useState<post[] | null>(null);
  const [profile, setProfile] = useState<profile | null>(null);

  //投稿一覧を取得
  useEffect(() => {
    fetchPosts();
  }, []);

  //postsテーブルから投稿を取得
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from("profiles")
      .select()
      .eq("id", session?.user.id)
      .then((result) => {
        if (result.data?.length) {
          setProfile(result.data[0]);
        }
      });
  }, [session?.user?.id]);

  //投稿を取得する関数
  const fetchPosts = () => {
    supabase
      .from("posts")
      .select("id, content, created_at, photos, profiles(id,name,avatar)")
      .order("created_at", { ascending: false })
      .then((result) => {
        if (result.data?.length) {
          setPosts(result.data as post[]);
        }
      });
  };

  // If the user is not logged in, show the login page
  if (!session) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <UserContext.Provider value={profile!}>
        <PostFormCard onPost={fetchPosts} />
        {posts?.length &&
          posts?.map((post) => <PostCard key={post.id} post={post} />)}
      </UserContext.Provider>
    </Layout>
  );
}
