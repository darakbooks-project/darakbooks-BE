import { rmSync } from 'fs';
import { parse } from 'path';

function required(key: string, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    // if (value == null) {
    //     throw new Error(`key ${key} is undefined`);
    // }
    return value;
}

export default () => ({
    app: {
        port: parseInt(required('PORT', 3000)),
        enviroment: required('NODE_ENV', 'development'),
        server:required('SERVER'),
    },
    db: {
        host: required('DATABASE_HOST'),
        port: parseInt(required('DATABASE_PORT', 3306)),
        username: required('DATABASE_USERNAME'),
        password: required('DATABASE_PASSWORD'),
        name: required('DATABASE_NAME'),
    },
    jwt: {
        jwtAccessSecret: required('JWT_SECRET_ACCESS'),
        accessExpiresInHour: parseInt(required('ACCESS_EXPIRES_HOUR', 6)),
        accessExpiresInSec: parseInt(required('ACCESS_EXPIRES_SEC', 30)),
        jwtRefreshSecret: required('JWT_SECRET_REFRESH'),
        refreshExpiresInDay: parseInt(required('REFRESH_EXPIRES_DAY', 60)),
    },
    kakao:{
        clientSecret : required('KAKAO_CLIENT_SECRET'),
        clientId : required('KAKAO_CLIENT_ID'),
        callbackURL:required('KAKAO_CALLBACK_URL')
    },
    s3:{
        accessKey: required('AWS_ACCESS_KEY_ID'),
        secretKey: required('AWS_SECRET_ACCESS_KEY'),
        bucket   : required('AWS_BUCKET_NAME'),
    },
    gpt:{
        openaiKey: required('OPENAI_API_KEY'),
        libraryKey: required('LIBRARY_API_KEY'),
    },
    cache:{
        host:required('CACHE_HOST'),
        port:required('CACHE_PORT'),
        password:required('CACHE_PASSWORD'),
        ttls:parseInt(required('CACHE_TTLS')),
    },
    redis:{
        ttls:parseInt(required('REDIS_TTLS'))
    },
    python:{
        path:required('PYTHON_PATH')
    }
    });