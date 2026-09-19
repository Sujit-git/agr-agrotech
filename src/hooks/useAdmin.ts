import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AdminState = {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
};

/**
 * Tracks the auth session and whether the signed-in user holds the admin role.
 * The role lives in the database (user_roles) and is enforced server-side by RLS.
 */
export function useAdmin(): AdminState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const resolveRole = async (next: Session | null) => {
      if (!next) {
        if (active) {
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", next.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      setSession(next);
      setIsAdmin(Boolean(data));
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      void resolveRole(next);
    });

    void supabase.auth.getSession().then(({ data }) => resolveRole(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { loading, session, isAdmin };
}
