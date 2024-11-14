import { Response, Request, NextFunction } from "express";

// Interface genérica para erros de validação
export interface ValidationError {
  message: string;
  field?: string | (string | number)[];
  type?: string;
}

// Interface para o validador
export interface SchemaValidator {
  validate(data: unknown): {
    success: boolean;
    errors?: ValidationError[];
  };
}

type RequestLocation = "body" | "params" | "query";

export function createRequestValidator(validator: SchemaValidator) {
  function validateData(data: unknown, res: Response): boolean {
    try {
      const result = validator.validate(data);

      if (!result.success) {
        res.status(400).json({
          success: false,
          errors: result.errors,
        });
        return false;
      }

      return true;
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: [{ message: "Erro interno de validação" }],
      });
      return false;
    }
  }

  function createValidator(location: RequestLocation) {
    return (req: Request, res: Response, next: NextFunction) => {
      const isValid = validateData(req[location], res);
      if (isValid) next();
    };
  }

  return {
    validateBody: createValidator("body"),
    validateParams: createValidator("params"),
    validateQuery: createValidator("query"),
    validateAll: (req: Request, res: Response, next: NextFunction) => {
      const bodyValid = validateData(req.body, res);
      if (!bodyValid) return;

      const paramsValid = validateData(req.params, res);
      if (!paramsValid) return;

      const queryValid = validateData(req.query, res);
      if (!queryValid) return;

      next();
    },
  };
}

// Exemplo de adaptador para Zod
export function createZodValidator(schema: any): SchemaValidator {
  return {
    validate(data: unknown) {
      try {
        schema.parse(data);
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          errors: error.errors.map((e: any) => ({
            message: e.message,
            field: e.path,
            type: e.code,
          })),
        };
      }
    },
  };
}

// Exemplo de adaptador para Joi
export function createJoiValidator(schema: any): SchemaValidator {
  return {
    validate(data: unknown) {
      const result = schema.validate(data, { abortEarly: false });

      if (result.error) {
        return {
          success: false,
          errors: result.error.details.map((detail) => ({
            message: detail.message,
            field: detail.path,
            type: detail.type,
          })),
        };
      }

      return { success: true };
    },
  };
}

// Exemplo de adaptador para Yup
export function createYupValidator(schema: any): SchemaValidator {
  return {
    validate(data: unknown) {
      try {
        schema.validateSync(data, { abortEarly: false });
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          errors: error.inner.map((err: any) => ({
            message: err.message,
            field: err.path,
            type: err.type,
          })),
        };
      }
    },
  };
}

// Exemplo de uso com diferentes bibliotecas:
/*
// Com Zod
import { z } from 'zod';
const zodSchema = z.object({
  name: z.string(),
  age: z.number()
});
const zodValidator = createZodValidator(zodSchema);
const requestValidator = createRequestValidator(zodValidator);

// Com Joi
import Joi from 'joi';
const joiSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required()
});
const joiValidator = createJoiValidator(joiSchema);
const requestValidator = createRequestValidator(joiValidator);

// Com Yup
import * as yup from 'yup';
const yupSchema = yup.object({
  name: yup.string().required(),
  age: yup.number().required()
});
const yupValidator = createYupValidator(yupSchema);
const requestValidator = createRequestValidator(yupValidator);

// Uso no router
router.post('/users', requestValidator.validateBody, userController.create);
*/
