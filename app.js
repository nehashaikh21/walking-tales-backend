import "dotenv/config";

import express from "express";
import authRouter from "./routes/auth.js";
import messagesRouter from "./routes/messages.js";
import connectToMongo from "./models/index.js";

if (!process.env.PORT) {
  console.log("please provide PORT number and try again");
  process.exit();
}
if (!process.env.SECRET) {
  console.log("please provide SECRET and try again");
  process.exit();
}

connectToMongo().then((connection) => {
  const app = express();
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/messages", messagesRouter);

  app.listen(process.env.PORT, () =>
    console.log("listening on " + process.env.PORT)
  );
});
