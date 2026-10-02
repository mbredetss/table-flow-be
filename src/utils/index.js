import orderRepositories from "../services/orders/repositories/order-repositories.js";

export const response = (res, statusCode, message, data) => {
  if (message) {
    return res
      .status(statusCode)
      .json({
        'status': statusCode < 400 ? 'success' : 'fail',
        message
      });
  }

  return res
    .status(statusCode)
    .json({
      'status': statusCode < 400 ? 'success' : 'fail',
      'data': data ?? {}
    });
};

export const clients = [];

export const notifyBaristas = async (orderId) => {
  const orderList = await orderRepositories.getOrder(orderId);

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(orderList)}\n\n`);
  });
}