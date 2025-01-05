import express, { Request, Response } from "express";
import authRoute from "./routes/auth";
import cloudinaryConnect from "./lib/cloudinary";
import fileUpload from "express-fileupload";
import dotnev from "dotenv";
dotnev.config();

const app = express();
const port = process.env.PORT || 3000;

cloudinaryConnect();
app.use(express.json());
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

app.listen(port, () => {
  console.log(
    `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
  );
});
