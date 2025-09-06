import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "@/config/envConfig";
import { ServiceResponse } from "../models/serviceResponse";
import { handleServiceResponse } from "../utils/httpHandlers";

export const authenticateRequest: RequestHandler = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization?.split(" ");
    if (!authorizationHeader) {
      handleServiceResponse(
        ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED),
        res
      );
      return;
    }
    const bearer = authorizationHeader[0];
    if (bearer !== "Bearer") {
      handleServiceResponse(
        ServiceResponse.failure(
          "Unauthorized - Bad Bearer",
          null,
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }
    const token = authorizationHeader[1];
    if (!token) {
      handleServiceResponse(
        ServiceResponse.failure(
          "Unauthorized - No Token",
          null,
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }

    const secretToken = env.SECRET_TOKEN;

    if (token !== secretToken) {
      handleServiceResponse(
        ServiceResponse.failure(
          "Unauthorized - Invalid token",
          null,
          StatusCodes.UNAUTHORIZED
        ),
        res
      );
      return;
    }
    next();
  } catch (error) {
    handleServiceResponse(
      ServiceResponse.failure("Unauthorized", error, StatusCodes.UNAUTHORIZED),
      res
    );
  }
};
