import { uploadUserPlofileImage } from "@/helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { ChangeEvent, useState } from "react";
import { FaCameraRetro } from "react-icons/fa";
import Preloader from "./Preloader";

type AvatarProps = {
  url?: string;
  editable?: boolean;
  size?: string;
  onChange?: VoidFunction;
};

const Avatar = ({ url, editable, onChange, size }: AvatarProps) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isUpLoading, setIsUpLoading] = useState<boolean>(false);

  const handleAvaterChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //アップロードするファイルを取得
    const file = e.target.files?.[0];
    if (file) {
      setIsUpLoading(true);
      //カバー画像をアップロード
      await uploadUserPlofileImage({
        supabase,
        userId: session?.user.id!,
        file,
        bucket: "avatars",
        profileCoulumn: "avatar",
      });
      //カバー画像を更新
      if (onChange) {
        await onChange();
      }
      return setIsUpLoading(false);
    }
  };

  let width = "w-12";
  if (size === "lg") {
    width = "w-24 md:w-36";
  }

  return (
    <div className={`${width} relative`}>
      <div className="rounded-full overflow-hidden">
        <img src={url!} alt="" className="w-full" />
      </div>
      {isUpLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center z-10 rounded-full">
          <div className="inline-block mx-auto">
            <Preloader />
          </div>
        </div>
      )}
      {editable && (
        <label className="cursor-pointer absolute right-0 bottom-0 shadow-md shadow-black p-2 bg-white rounded-full">
          <input type="file" className="hidden" onChange={handleAvaterChange} />
          <FaCameraRetro />
        </label>
      )}
    </div>
  );
};
export default Avatar;
