import { Injectable } from '@nestjs/common';
import {S3} from 'aws-sdk' ;

@Injectable()
export class S3Service{
    private readonly s3:S3;

    constructor(private configService: ConfigService){
        this.s3 = new S3({
            accessKeyId:this.configService.get('s3.accessKey'),
            secretAccessKey:this.configService.get('s3.secretKey'),
        })
    }

}