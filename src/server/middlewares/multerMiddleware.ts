import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const destinationPath = "uploads/";

const storage = multer.diskStorage({
  destination(req, file, setPath) {
    setPath(null, destinationPath);
  },
  filename(req, file, setFileName) {
    const uniquePrefix = uuidv4();
    const mimetype = file.mimetype.split("/");
    const extension = mimetype[mimetype.length - 1];
    setFileName(null, `${uniquePrefix}-${file.fieldname}.${extension}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 3000000 } });

const multerMiddleware = upload.single("avatar");

export default multerMiddleware;
