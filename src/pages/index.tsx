import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostFormCard from "@/components/PostFormCard";
import { useSession } from "@supabase/auth-helpers-react";
import LoginPage from "./login";

export default function Home() {
  const session = useSession();

  // If the user is not logged in, show the login page
  if (!session) {
    return <LoginPage />;
  }
  return (
    <Layout>
      <PostFormCard />
      {/* <PostCard /> */}
    </Layout>
  );
}
