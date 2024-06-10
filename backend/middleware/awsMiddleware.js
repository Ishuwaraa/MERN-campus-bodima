const { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_BUCKET_REGION
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: function (req, file, nextFunc) {
            nextFunc(null, { fieldName: file.fieldname })
        },
        key: function (req, file, nextFunc) {
            nextFunc(null, `${Date.now().toString()}-${file.originalname}`);    //generating a unique image name
        }
    })
}).array('photos', 4);

const deleteImages = async (imageArray) => {
    await Promise.all(imageArray.map(async (image) => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image
        }

        try{
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
        } catch (err) {
            console.log('Error deleting image ', image);
            throw err;
        }
    }));
}

const getImageUrls = async (imageArray, expTime) => {
    //creating urls parallely
    //.map creates an array of promisses. promise.all waits for all them to resolve or reject    
    const urls = await Promise.all(imageArray.map(async (image) => {
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image
        };
    
        try {
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: expTime });   //exp in 15mins
            return url;
        } catch (error) {
            console.log(`Error getting signed URL for image ${image}:`, error);
            throw error;
        }
    }));
    // console.log(Array.isArray(urls))
    return urls;
}

module.exports = { s3, upload, deleteImages, getImageUrls };