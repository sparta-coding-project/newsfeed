import multer from "multer";
import path from "path";

//multer.diskStorage()함수의 콜백 함수에는 req, file, done 세개의 매개변수만 사용 가능
export const upload = multer({
  //이미지 파일만 허용
  fileFilter(req, file, done) {
    if (file.mimetype.lastIndexOf("image") > -1) {
      done(null, true);
    } else {
      done(null, false);
    }
  },
  //파일 저장 위치(disk, memory 선택)
  storage: multer.diskStorage({
    destination: function (req, file, done) {
      done(null, `${process.env.STATIC_URL}`);
    },
    filename: function (req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  //파일 허용 사이즈(5MB)
  limits: { fileSize: 5 * 1024 * 1024 },
});
