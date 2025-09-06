import type { Request, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { IWebHistory } from "./webHistory.types";
import { webHistoryService } from "./webHistory.service";

export class WebHistoryController {
    async createWebHistory(req: Request, res: Response) {
        const historyData = req.body as IWebHistory;
        return handleServiceResponse(await webHistoryService.createWebHistory(historyData), res);
    }
}

export const webHistoryController = new WebHistoryController()