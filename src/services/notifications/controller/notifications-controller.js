import { response } from "../../../utils/index.js";
import orderRepositories from "../../orders/repositories/order-repositories.js";

export const midTransNotifications = async (req, res) => {
    const { order_id, transaction_status, fraud_status } = req.body;

    if (transaction_status == 'capture') {
        if (fraud_status == 'accept') {
            await orderRepositories.updateOrderStatus(order_id, 'success');
        }
    } else if (transaction_status == 'settlement') {
        await orderRepositories.updateOrderStatus(order_id, 'success');
    } else if (transaction_status == 'cancel' ||
        transaction_status == 'deny' ||
        transaction_status == 'expire') {
        await orderRepositories.updateOrderStatus(order_id, 'failure');
    } else if (transaction_status == 'pending') {
        await orderRepositories.updateOrderStatus(order_id, 'pending');
    }

    response(res, 200, 'success', null);
}