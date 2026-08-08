import Joi from 'joi';

export const addMenuPayloadSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(), 
  description: Joi.string(),
});