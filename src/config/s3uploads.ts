import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

dotenv.config();

export const uploadFile = async (file: Express.Multer.File, fileName: string): Promise<string> => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const fileBuffer = fs.readFileSync(file.path);

    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    // handle error
    console.error('Failed to upload file to S3:', error);
    throw error;
  }
};
