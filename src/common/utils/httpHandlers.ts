import type { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, type ZodSchema } from "zod";
import { ServiceResponse } from "../models/serviceResponse.js";


export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response): void => {
  response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest =
  (schema: ZodSchema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = (err.issues as any[])
          .map(
            (e) =>
              `Field "${e.path.join(".")}" is ${e.message.toLowerCase()} (expected: ${
                e.expected as any
              }, received: ${e?.received as any}).`,
          )
          .join(" ");
        const errorMessage = `Invalid input: ${formattedErrors}`;
        const statusCode = StatusCodes.BAD_REQUEST;
        const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
        handleServiceResponse(serviceResponse, res);
        return; // 🔹 Explicitly return to ensure `void` type
      }
      next(err);
    }
  };
