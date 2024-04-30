import { app } from "./app";

const PORT = 4242;

app.listen(PORT, () => {
  console.info("Server is running on port", PORT);
});
