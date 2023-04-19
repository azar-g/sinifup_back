import fileRouter from "./routers/fileRouter.js";
import apiRouter from "./routers/apiRouter";
import authRouter from "./routers/authRouter";
import express from "express";
import cors from "cors";
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

// APP
const app = express();

// CORS
app.use(cors());

// Get acces to req body
app.use(express.json());
// app.use(cookieParser(process.env.JWT_SECRET));
// console.log(apiRouter);

// app.get("/api/getAllStudents", (req, res) => {
//   res.send("students qosuldu");
// });

// ROUTERS

app.use(`/api`, apiRouter);
app.use(`/auth`, authRouter);
app.use(`/file`, fileRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// SERVING IMAGES
app.use(express.static("public"));

// UNHANDLED ROUTES
/* app.use("/", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "No resuorce found!",
  });
}); */

export default app;
