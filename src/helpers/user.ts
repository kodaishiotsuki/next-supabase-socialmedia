import { SupabaseClient } from "@supabase/supabase-js";

export const uploadUserPlofileImage = async ({
  supabase,
  userId,
  file,
  bucket,
  profileCoulumn,
}: {
  supabase: SupabaseClient;
  userId: string;
  file: File;
  bucket: string;
  profileCoulumn: string;
}): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const newName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(newName, file);

    if (error) throw error;

    //アップロードした画像のURLを取得
    if (data) {
      const url =
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        `/storage/v1/object/public/${bucket}/` +
        data.path;
      //profilesテーブルのカラムを更新
      supabase
        .from("profiles")
        .update({ [profileCoulumn]: url })
        .eq("id", userId)
        .then((result) => {
          if (!result.error) {
            //親コンポーネントのfetchUserを実行
            resolve();
          } else {
            throw result.error;
          }
        });
    }
  });
};
