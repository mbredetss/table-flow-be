import { nanoid } from "nanoid";
import { clients, response } from "../../../utils/index.js";
import menuRepositories from "../../menus/repositories/menu-repositories.js";
import tableRepositories from "../../tables/repositories/table-repositories.js";
import core from "../payment/payment-gateway-config.js";
import orderRepositories from "../repositories/order-repositories.js";

export const orderMenu = async (req, res) => {
    const { tableId, orders } = req.validated;

    // check table exist
    const getTableResult = await tableRepositories.getTableById(tableId);
    const isTableExistance = getTableResult.length > 0;
    if (!isTableExistance) return response(res, 404, 'tabel tidak ditemukan!', null);

    // check menu exist
    let isMenuExistance = null;
    for (let order of orders) {
        const getMenuResult = await menuRepositories.getMenuById(order.menuId);

        isMenuExistance = getMenuResult.length > 0 ? true : false;
    }
    if (!isMenuExistance) return response(res, 404, 'menu tidak ditemukan!', null);

    const prices = await Promise.all(
        orders.map(async (order) => {
            const result = await menuRepositories.getMenuById(order.menuId);

            return result[0].price * order.quantity;
        })
    );
    const orderTotal = prices.reduce((total, price) => total + price, 0);
    const orderId = `order-${nanoid(16)}`;

    const parameter = {
        payment_type: 'gopay',
        transaction_details: {
            gross_amount: orderTotal,
            order_id: orderId,
        }
    };
    const chargeResponse = await core.charge(parameter);

    for (let order of orders) {
        await orderRepositories.addOrder(orderId, tableId, order.menuId, order.quantity);
    }

    const generateQRCode = chargeResponse.actions[0];
    const deeplinkRedirect = chargeResponse.actions[2];
    const orderDetail = {
        qrImageURL: [generateQRCode.url, deeplinkRedirect.url],
        tableId,
        orderId,
        orders,
        grossAmount: orderTotal,
    };

    return response(res, 200, null, { orderDetail });
}

export const getOrderSSE = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        const index = clients.indexOf(res);
        clients.splice(index, 1);
    });
}

export const updateOrderStatus = async (req, res) => {
    const orderId = req.params.id;
    const status = req.validated.status;

    const result = await orderRepositories.updateOrderStatus(orderId, status);

    if (result.rowCount === 0) return response(res, 404, 'pesanan tidak ditemukan!', null);

    const newStatus = { status: result.rows[0].status };
    response(res, 201, null, newStatus);
}