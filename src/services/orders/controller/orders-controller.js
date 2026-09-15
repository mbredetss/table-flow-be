import { nanoid } from "nanoid";
import { response } from "../../../utils/index.js";
import menuRepositories from "../../menus/repositories/menu-repositories.js";
import tableRepositories from "../../tables/repositories/table-repositories.js";
import core from "../payment/payment-gateway-config.js";

export const orderMenu = async (req, res) => {
    const { tableId, orderList } = req.validated;

    // check table exist
    const getTableResult = await tableRepositories.getTableById(tableId);
    const isTableExistance = getTableResult.length > 0;
    if (!isTableExistance) return response(res, 404, 'tabel tidak ditemukan!', null);

    // check menu exist
    let isMenuExistance = null;
    for (let menuId of orderList) {
        const getMenuResult = await menuRepositories.getMenuById(menuId);

        isMenuExistance = getMenuResult.length > 0 ? true : false;
    }
    if (!isMenuExistance) return response(res, 404, 'menu tidak ditemukan!', null);

    const prices = await Promise.all(
        orderList.map(async (menu) => {
            const result = await menuRepositories.getMenuById(menu);

            return result[0].price;
        })
    );
    const orderTotal = prices.reduce((total, price) => total + price, 0)
    const orderId = `order-${nanoid(16)}`;

    const parameter = {
        payment_type: 'gopay',
        transaction_details: {
            gross_amount: orderTotal,
            order_id: orderId,
        }
    };
    const chargeResponse = await core.charge(parameter);

    const [ generateQRCode, deeplinkRedirect ] = chargeResponse.actions;
    const { status_code, gross_amount, order_id } = chargeResponse;
    const APIChargeResponse = {
        statusCode: status_code, 
        grossAmount: Number(gross_amount), 
        orderId: order_id, 
    };
    const orderDetail = {
        qrImageURL: process.NODE_ENV !== 'production' ? deeplinkRedirect.url : generateQRCode.url,
        tableId,
        order: orderList, 
        APIChargeResponse, 
    };

    return response(res, 200, null, { orderDetail });
}