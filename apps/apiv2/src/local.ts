import { app } from "@/app";
import { serve } from "@hono/node-server";

const PORT = process.env.PORT ?? 4242;

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => console.info("Server is running on port", info.port),
);
