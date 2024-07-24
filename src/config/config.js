import {config} from 'dotenv';

config();
module.exports = {
    local: {
        username: process.env.DATABASE_USER_LOCAL,
        password: process.env.DATABASE_PASS_LOCAL,
        database: process.env.DATABASE_DATABSE_LOCAL,
        host: process.env.DATABASE_HOST_LOCAL,
        port: process.env.DATABASE_PORT_LOCAL,
        dialect: 'mysql',
        logging: false,
        log:console.log,
        define: {
          timestamps: true,
          underscored: true
        }
    },
    development: {
        username: process.env.DATABASE_USER_DEVELOPEMENT,
        password: process.env.DATABASE_PASS_DEVELOPEMENT,
        database: process.env.DATABASE_DATABSE_DEVELOPEMENT,
        host: process.env.DATABASE_HOST_DEVELOPEMENT,
        port: process.env.DATABASE_PORT_DEVELOPEMENT,
        dialect: 'mysql',
        logging: false,
        acquireTimeout: 1000000,
        queryTimeout: 60000,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        define: {
          timestamps: true,
          underscored: true
        }
    },
    production: {
        username: process.env.DATABASE_USER_PRODUCTION,
        password: process.env.DATABASE_PASS_PRODUCTION,
        database: process.env.DATABASE_DATABSE_PRODUCTION,
        host: process.env.DATABASE_HOST_PRODUCTION,
        port: process.env.DATABASE_PORT_PRODUCTION,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        define: {
          timestamps: true,
          underscored: true
        }
    },
};
