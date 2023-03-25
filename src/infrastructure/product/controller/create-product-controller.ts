import * as joi from 'joi'
import { Request, Response } from "express";
import CreateProduct from "../../../application/product/create/create-product";
import { CreateProductCommand } from "../../../application/product/create/create-product-command";
import { InvalidJsonSchemaError } from '../../error/invalid-json-schema-error';

export default class CreateProductController {
    constructor (private readonly createProduct: CreateProduct) {}

    handle = async (req: Request, res: Response): Promise<void> => {
        const requestBody = this.ensureValidRequestBody(req)

        const command = new CreateProductCommand(
          requestBody.data.id,
          requestBody.data.attributes.name,
          requestBody.data.relationships.category.id
        )
        await this.createProduct.execute(command)

        res.status(201).send()  
    }

    private ensureValidRequestBody (req: Request): any {
        const schema = joi.object({
          data: joi.object({
            id: joi.string().uuid().required(),
            attributes: joi.object({
              name: joi.string().required()
            }).required(),
            relationships: joi.object({
              category: joi.object({
                id: joi.string().required()
              }).required(),
            }).required(),
          }).required()
        })
        const validationResult = schema.validate(req.body)
    
        if (validationResult.error != null) {
          throw new InvalidJsonSchemaError(validationResult.error.message)
        }
    
        return validationResult.value
    }
}