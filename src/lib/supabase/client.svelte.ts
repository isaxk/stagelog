import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Tables } from "./types";

export const supabase: {
    client: SupabaseClient | null,
    session: Session | null,
    user: User | null,
    userProfile: Tables<'profiles'>|null,
} = $state({client:null, session: null, user: null, userProfile: null});




