import midtransClient from "midtrans-client";
import "dotenv/config";

const midtrans = new midtransClient.Snap({
    isProduction: false, // false untuk sandbox, true untuk production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default midtrans;
