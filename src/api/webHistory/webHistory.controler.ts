import type { Request, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { IWebHistory } from "./webHistory.types";
import { webHistoryService } from "./webHistory.service";
import { WebHistoryFilters } from "./webHistory.schema";

export class WebHistoryController {
    async createWebHistory(req: Request, res: Response) {
        const historyData = req.body as IWebHistory;
        return handleServiceResponse(await webHistoryService.createWebHistory(historyData), res);
    }
    async getWebHistoryByFilters(req: Request, res: Response) {
        const historyData = req.body as WebHistoryFilters;
        return handleServiceResponse(await webHistoryService.getWebHistoryByFilters(historyData), res);
    }
}

export const webHistoryController = new WebHistoryController()