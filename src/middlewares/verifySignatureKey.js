import crypto from 'crypto';
import { response } from "../utils/index.js";

const verifySignatureKey = (req, res, next) => {
    const { order_id, status_code, gross_amount, signature_key } = req.body;
    const serverKey = process.env.AUTH_SERVER;

    const rawString = order_id + status_code + gross_amount + serverKey;
    const computedHash = crypto
    .createHash('sha512')
    .update(rawString)
    .digest('hex');

    if (computedHash === signature_key) return next();

    return response(res, 403, 'signature key tidak valid!', null);
}

export default verifySignatureKey;