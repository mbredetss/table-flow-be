import Joi from 'joi';

export const menuPayloadSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(), 
  description: Joi.string(),
});