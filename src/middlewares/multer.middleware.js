import multer from "multer";
import path from "path";
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import moment from 'moment';
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESSKEY_ID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: process.env.BUCKET_REGION
})

const storage = multerS3({
    s3: s3,
    acl: 'public-read-write',
    bucket: process.env.BUCKET_NAME,
    key: (req, file, callback) => {
        const uploadDirectory = req.query.uploadDirectory
        const ext = path.extname(file.originalname);

        callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
    }

})


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
    storage: storage,
    //파일 허용 사이즈(5MB)
    limits: { fileSize: 5 * 1024 * 1024 },
});
