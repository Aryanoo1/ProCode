import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_images",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });

export default upload;
