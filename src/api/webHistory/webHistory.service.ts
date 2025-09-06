import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse.js";
import { query } from "@/db.js";
import type { IWebHistory } from "./webHistory.types.js";

export class WebHistoryService {
  // Insert a new web history record
  async createWebHistory(historyData: IWebHistory) {
    try {
      const sqlQuery = `
      INSERT INTO web_search_history
        (email, profile, search_type, query, url, domain)
      VALUES
        (@email, @profile, @search_type, @query, @url, @domain)
    `;

      // Execute query
      const result = await query(sqlQuery, {
        email: historyData.email,
        profile: historyData.profile,
        search_type: historyData.searchType,
        query: historyData.query ?? null,
        url: historyData.url ?? null,
        domain: historyData.domain ?? null,
      });
      if (result.rowsAffected[0] === 1) {
        return ServiceResponse.success(
          `${historyData.profile} History record inserted successfully`,
          result
        );
      }
      return ServiceResponse.failure(
        `${historyData.profile} History insertion failed`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } catch (error) {
      console.error(error);
      return ServiceResponse.failure(
        "Internal server error at web history insertion",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const webHistoryService = new WebHistoryService()