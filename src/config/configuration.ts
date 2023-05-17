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
        name: required('DATABASE_NAME2'),
    },
});