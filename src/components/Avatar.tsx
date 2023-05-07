import { uploadUserPlofileImage } from "@/helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ChangeEvent } from "react";
import { FaCameraRetro } from "react-icons/fa";

type AvatarProps = {
  url?: string;
  editable?: boolean;
  onChange?: VoidFunction;
};

const Avatar = ({ url, editable, onChange }: AvatarProps) => {
  const supabase = useSupabaseClient();
  const session = useSession();

  const handleAvaterChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //アップロードするファイルを取得
    const file = e.target.files?.[0];
    if (file) {
      //カバー画像をアップロード
      await uploadUserPlofileImage({
        supabase,
        userId: session?.user.id!,
        file,
        bucket: "avatars",
        profileCoulumn: "avatar",
      });
      //カバー画像を更新
      onChange && onChange();
    }
  };

  return (
    <div className="relative w-12 md:w-36">
      <div className="rounded-full overflow-hidden">
        <img src={url!} alt="" className="w-full" />
      </div>
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
