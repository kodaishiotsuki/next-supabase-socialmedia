import { profile } from "@/types/profile";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FcEditImage } from "react-icons/fc";
import Avatar from "../components/Avatar";
import Card from "../components/Card";
import Cover from "../components/Cover";
import Layout from "../components/Layout";
import ProfileTabs from "../components/ProfileTabs";

export default function ProfilePage() {
  const [profile, setProfile] = useState<profile | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const router = useRouter();
  const userId = router.query.id;
  const tab = router?.query?.tab?.[0] || "posts";
  const supabase = useSupabaseClient();
  const session = useSession();
  //ログインユーザーのプロフィールかどうか
  const isMyUser = session?.user?.id === userId;

  //profileテーブルにユーザー情報を保存
  const fetchUser = useCallback(() => {
    supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .then((result) => {
        if (result.error) {
          throw result.error;
        }
        if (result.data?.length) {
          setProfile(result.data[0]);
        }
      });
  }, [supabase, userId]);

  //profileテーブルからユーザー情報を取得
  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchUser();
  }, [fetchUser, userId]);

  //profileテーブルにユーザー情報を保存
  const saveProfile = () => {
    supabase
      .from("profiles")
      .update({
        name,
        place,
      })
      .eq("id", session?.user.id)
      .then((result) => {
        //エラーがなければ、profileのnameとplaceを更新
        if (!result.error) {
          setProfile((prev) => ({ ...prev, name, place }));
        }
        setEditMode(false);
      });
  };

  return (
    <Layout>
      <Card noPadding={true}>
        <div className="relative overflow-hidden rounded-md">
          <Cover
            url={profile?.cover}
            editable={isMyUser}
            onChange={fetchUser}
          />

          <div className="absolute top-24 left-4 z-20">
            {profile && (
              <Avatar
                url={profile.avatar}
                editable={isMyUser}
                size={"lg"}
                onChange={fetchUser}
              />
            )}
          </div>

          <div className="p-4 pt-0 md:pt-4 pb-0">
            <div className="ml-24 md:ml-40 flex justify-between">
              <div>
                {editMode && (
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-gray-300 rounded-md p-1"
                      placeholder="Your name"
                    />
                  </div>
                )}
                {!editMode && (
                  <h1 className="text-3xl font-bold">
                    {!editMode && profile?.name}
                  </h1>
                )}
                {!editMode && (
                  <div className="text-gray-500 leading-4">
                    {profile?.place || "internet"}
                  </div>
                )}
                {editMode && (
                  <div>
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      className="border-2 border-gray-300 rounded-md p-1"
                      placeholder="Your place"
                    />
                  </div>
                )}
              </div>

              <div className="grow">
                <div className="text-right">
                  {isMyUser && !editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setName(profile?.name!);
                        setPlace(profile?.place!);
                      }}
                      className="inline-flex gap-2 items-center rounded-md shadow-sm shadow-gray-500 py-1 px-2"
                    >
                      <FcEditImage />
                      Edit profile
                    </button>
                  )}

                  {isMyUser && editMode && (
                    <>
                      <button
                        onClick={saveProfile}
                        className="inline-flex gap-2 items-center rounded-md shadow-sm shadow-gray-500 py-1 px-2 mx-2"
                      >
                        Save profile
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="inline-flex gap-2 items-center rounded-md shadow-sm shadow-gray-500 py-1 px-2"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* <div className="grow">
                <div className="text-right">
                  {isMyUser && !editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setName(profile.name);
                        setPlace(profile.place);
                      }}
                      className="inline-flex mx-1 gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit profile
                    </button>
                  )}
                  {isMyUser && editMode && (
                    <button
                      onClick={saveProfile}
                      className="inline-flex mx-1 gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2"
                    >
                      Save profile
                    </button>
                  )}
                  {isMyUser && editMode && (
                    <button
                      onClick={() => setEditMode(false)}
                      className="inline-flex mx-1 gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div> */}
            </div>
            <ProfileTabs active={tab} userId={profile?.id} />
          </div>
        </div>
      </Card>{" "}
    </Layout>
  );
}
