import Joi from 'joi';

export const orderPayloadSchema = Joi.object({
    tableId: Joi.string().required(), 
    orderList: Joi.array()
    .items(Joi.string())
    .min(1)
    .required(),
});