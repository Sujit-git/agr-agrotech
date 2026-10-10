// TEMPORARY one-shot admin password reset route. Delete after use.
import { createFileRoute } from "@tanstack/react-router";

const RESET_TOKEN = "7f3c9a1e-b2d4-4e8f-9c6a-5d1e0a2b8f47";
const NEW_PASSWORD = "AgrAdmin!K7x2Q9p4";

export const Route = createFileRoute("/api/admin-reset")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (auth !== `Bearer ${RESET_TOKEN}`) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError)
          return Response.json(
            { step: "list", error: JSON.stringify(listError) },
            { status: 500 },
          );
        const admin = users.users.find((u) => u.email === "agrotech@agr.com");
        if (!admin) return Response.json({ error: "admin user not found" }, { status: 404 });
        const { error } = await supabaseAdmin.auth.admin.updateUserById(admin.id, {
          password: NEW_PASSWORD,
        });
        if (error)
          return Response.json(
            { step: "update", error: JSON.stringify(error) },
            { status: 500 },
          );
        return Response.json({ ok: true });
      },
    },
  },
});
