import midTransClient from 'midtrans-client';

const core = new midTransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.AUTH_SERVER,
    clientKey: process.env.AUTH_CLIENT,
});

export default core;