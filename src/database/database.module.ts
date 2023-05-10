import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory:(configService:ConfigService)=>({
                type: 'mysql',
                host: configService.get('db.host'),
                port:configService.get('db.port'),
                username:configService.get('db.username'),
                password:configService.get('db.password'),
                name:configService.get('db.name'),
                entities:[],
            })
        })
    ]
})
export class DatabaseModule {}
