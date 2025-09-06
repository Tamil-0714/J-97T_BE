import { Router } from "express";
import { API_PATHS } from "@/common/utils/api.paths";
import { webHistoryController } from "./webHistory.controler";
import { asyncHandler } from "@/common/middlewares/asyncHandler";
import { validateRequest } from "@/common/utils/httpHandlers";
import { CreateWebHistorySchema, GetWebHistoryByFiltersSchema } from "./webHistory.schema";
import { authenticateRequest } from "@/common/middlewares/authenticationHandler";
export const WEB_HISTORY_BASE_PATH = API_PATHS.WEB_HISTORY.BASE
export const WEB_HISTORY_ROUTE_PATHS = {
    CREATE_WEB_HISTORY : WEB_HISTORY_BASE_PATH + API_PATHS.WEB_HISTORY.ROUTES.CREATE,
    FILTER_WEB_HISTORY : WEB_HISTORY_BASE_PATH + API_PATHS.WEB_HISTORY.ROUTES.FILTER_HISTORY,
}
export function createWebHistoryRouter():Router {
    const router = Router();

    router.post(
        WEB_HISTORY_ROUTE_PATHS.CREATE_WEB_HISTORY,
        validateRequest(CreateWebHistorySchema),
        authenticateRequest,
        asyncHandler(webHistoryController.createWebHistory)
    )
    router.post(
        WEB_HISTORY_ROUTE_PATHS.FILTER_WEB_HISTORY,
        validateRequest(GetWebHistoryByFiltersSchema),
        authenticateRequest,
        asyncHandler(webHistoryController.getWebHistoryByFilters)
    )
    return router;
}

export const webHistoryRouter = createWebHistoryRouter()