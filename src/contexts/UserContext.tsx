import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { profile } from "@/types/profile";

type ContextType = {
  profile: profile | undefined | null;
};

const UserContext = createContext<ContextType>({
  profile: undefined,
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState<profile | null>();

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .then((result) => {
        setProfile(result.data?.[0] as profile);
      });
  }, [session?.user?.id, supabase]);

  return (
    <UserContext.Provider value={{ profile }}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
