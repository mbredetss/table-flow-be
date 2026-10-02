import { notifyBaristas, response } from "../../../utils/index.js";
import orderRepositories from "../../orders/repositories/order-repositories.js";

export const midTransNotifications = async (req, res) => {
    const { order_id, transaction_status, fraud_status } = req.body;

    if (transaction_status == 'capture') {
        if (fraud_status == 'accept') {
            await orderRepositories.updateOrderStatus(order_id, 'success');
            notifyBaristas(order_id);
        }
    } else if (transaction_status == 'settlement') {
        await orderRepositories.updateOrderStatus(order_id, 'success');
        notifyBaristas(order_id);
    } else if (transaction_status == 'cancel' ||
        transaction_status == 'deny' ||
        transaction_status == 'expire') {
        await orderRepositories.updateOrderStatus(order_id, 'failure');
    }

    response(res, 200, 'success', null);
}