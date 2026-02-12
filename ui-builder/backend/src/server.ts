import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { uiBuilderRouter } from "./modules/ui-builder/uiBuilderController";

const app = express();
app.use(cors());
app.use(json());

app.use("/ui-builder", uiBuilderRouter);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`UI Builder backend running on port ${PORT}`);
});
