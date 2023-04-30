import { profile } from "./profile";
export type post = {
  id?: string;
  content?: string;
  created_at?: string;
  profiles?: profile;
};
