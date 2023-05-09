function required(key:string, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    console.log(value);
    if (value == null) {
        throw new Error(`key ${key} is undefined`);
    }
    return value;
}

export default()=>( {
    app: {
        port: parseInt(required('PORT', 3000)),
        enviroment: required('NODE_ENV', 'development'),
    },
    database: {
        host: required('DATABASE_HOST'),
        port: parseInt(required('DATABASE_PORT', 3306)),
        username: required('DATABASE_USERNAME'),
        password: required('DATABASE_PASSWORD'),
        name: required('DATABASE_NAME'),
    },
    jwt: {
        jwtAccessSecret: required('JWT_SECRET_ACCESS'),
        accessExpiresInSec: parseInt(required('ACCESS_EXPIRES_SEC', 86400)),
        jwtRefreshSecret: required('JWT_SECRET_REFRESH'),
        refreshExpiresInSec: parseInt(required('REFRESH_EXPIRES_SEC', 86400)),
    },
    search_api: {
        search_url: required('SEARCH_URL'),
        search_key: required('SEARCH_KEY')
    }
});