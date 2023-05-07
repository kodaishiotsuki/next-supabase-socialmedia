import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { ChangeEvent, useState } from "react";
import { FaCameraRetro } from "react-icons/fa";
import Preloader from "./Preloader";
import { uploadUserPlofileImage } from "@/helpers/user";

const Cover = ({
  url,
  editable,
  onChange,
}: {
  url?: string;
  editable: boolean;
  onChange: VoidFunction;
}) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isUpLoading, setIsUpLoading] = useState<boolean>(false);

  //カバー画像の更新
  const updateCover = async (e: ChangeEvent<HTMLInputElement>) => {
    //アップロードするファイルを取得
    const file = e.target.files?.[0];
    if (file) {
      setIsUpLoading(true);
      //カバー画像をアップロード
      await uploadUserPlofileImage({
        supabase,
        userId: session?.user.id!,
        file,
        bucket: "covers",
        profileCoulumn: "cover",
      });
      setIsUpLoading(false);
      //カバー画像を更新
      onChange && onChange();
    }
  };

  return (
    <div className="h-36 overflow-hidden flex justify-center items-center relative">
      <div>
        <img src={url} alt="" />
      </div>
      {isUpLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center z-10">
          <div className="inline-block mx-auto">
            <Preloader />
          </div>
        </div>
      )}
      {editable && (
        <div className="absolute right-0 bottom-0 m-2">
          <label className="bg-white py-1 px-2 rounded-md shadow-md shadow-black flex items-center gap-2 cursor-pointer">
            <input type="file" onChange={updateCover} className="hidden" />
            <FaCameraRetro />
            Change cover image
          </label>
        </div>
      )}
    </div>
  );
};

export default Cover;
