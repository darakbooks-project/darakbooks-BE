function required(key:string, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    // if (value == null) {
    //     throw new Error(`key ${key} is undefined`);
    // }
    return value;
}

export default()=>( {
    app: {
        port: parseInt(required('PORT', 3000)),
        enviroment: required('NODE_ENV', 'development'),
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
        jwtRefreshSecret: required('JWT_SECRET_REFRESH'),
        refreshExpiresInDay: parseInt(required('REFRESH_EXPIRES_DAY', 60)),
    },
    search_api: {
        search_url: required('SEARCH_URL'),
        search_key: required('SEARCH_KEY')
    },
    kakao:{
        clientSecret : required('KAKAO_CLIENT_SECRET'),
        clientId : required('KAKAO_CLIENT_ID'),
        callbackURL:required('KAKAO_CALLBACK_URL')
    }
});