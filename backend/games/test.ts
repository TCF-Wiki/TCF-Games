console.log("Test");

import { app, io } from "../server";

app.get("/api/test", (req, res) => {
  res.send("Test");
});
