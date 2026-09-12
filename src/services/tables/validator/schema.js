import Joi from 'joi';

export const tableCountPayloadSchema = Joi.object({
    tableCount: Joi.number().required()
});