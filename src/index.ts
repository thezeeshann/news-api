import express, { Request, Response } from "express";
import authRoute from "./routes/auth";
import postRoute from "./routes/post";
import commentRoute from "./routes/comment";
import cloudinaryConnect from "./lib/cloudinary";
import userRoute from "./routes/profile";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotnev from "dotenv";
dotnev.config();

const app = express();
const port = process.env.PORT || 3000;

cloudinaryConnect();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "temp",
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);

app.listen(port, () => {
  console.log(
    `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
  );
});
