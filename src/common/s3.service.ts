import {Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {S3} from 'aws-sdk' ;

@Injectable()
export class S3Service{
    private readonly s3:S3;

    constructor(private configService: ConfigService){
        this.s3 = new S3({
            accessKeyId:this.configService.get('s3.accessKey'),
            secretAccessKey:this.configService.get('s3.secretKey'),
        });
    }

    async uploadFile(file: Express.Multer.File):Promise<Object>{
        try {
             //클라이언트에서 받은 이름 그대로 사용시 중복된 이름이 발생될 수 있으니 난수생성으로 이름 바꾸기
            const filename = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const params   = {
                Bucket : this.configService.get('s3.bucket'),
                Key    : filename,
                Body   : file.buffer, 
                ContentType : file.mimetype,
            }
            const result = await this.s3.upload(params).promise();
            return {'filename':filename, 'location':result.Location};
        } catch (error) {
            throw new InternalServerErrorException(`File upload failed : ${error}`);
        }
    }

    async deleteFile(filename: string){
        try {
            //클라이언트에서 받은 이름 그대로 사용시 중복된 이름이 발생될 수 있으니 난수생성으로 이름 바꾸기
           const params   = {
               Bucket : this.configService.get('s3.bucket'),
               Key    : filename,
           }
           const result = await this.s3.deleteObject(params).promise();
       } catch (error) {
           throw new InternalServerErrorException(`File delete failed : ${error}`);
       }
    }

    async getFile(fileKey : string ){
        // try {
        //     const params   = {
        //         Bucket : this.configService.get('s3.bucket'),
        //         Key    : fileKey,
        //     }
        //     const result = await this.s3.getObject(params).promise() ;
            
        // } catch (error) {
        //     throw new InternalServerErrorException(`File get failed : ${error}`);
        // }
        return `https://${this.configService.get('s3.bucket')}.s3.amazonaws.com/${fileKey}`;
    }

}