import Joi from 'joi';

export const orderPayloadSchema = Joi.object({
    tableId: Joi.string().required(), 
    orders: Joi.array()
    .items(Joi.object({
        menuId: Joi.string().required(), 
        quantity: Joi.number().required(), 
    }))
    .min(1)
    .required(),
});