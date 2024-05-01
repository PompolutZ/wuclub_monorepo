import { app } from "./app";

const PORT = process.env.PORT ?? 4242;

app.listen(PORT, () => {
  console.info("Server is running on port", PORT);
});
