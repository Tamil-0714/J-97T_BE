import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse.js";
import { query } from "@/db.js";
import _ from "lodash";
import type { IWebHistory } from "./webHistory.types.js";
import { WebHistoryFilters } from "./webHistory.schema.js";
import { WEB_HISTORY_FILTER_LIMIT } from "@/common/utils/constants.js";

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
  async getWebHistoryByFilters(advancedFilters: WebHistoryFilters) {
    try {
      let sqlQuery = "SELECT * FROM web_search_history";
      const whereClauses: string[] = [];
      const params: Record<string, any> = {};
      let paramCounter = 0;

      const getParamName = (base: string) => {
        paramCounter++;
        return `${base}_${paramCounter}`;
      };

      // Process advanced conditions
      if (advancedFilters.conditions && advancedFilters.conditions.length > 0) {
        const conditionClauses = advancedFilters.conditions
          .map((condition) => {
            const { field, operator, value } = condition;
            const paramName = getParamName(field);

            switch (operator) {
              case "equals":
                params[paramName] = value;
                return `${field} = @${paramName}`;

              case "contains":
                params[paramName] = value;
                return `${field} LIKE '%' + @${paramName} + '%'`;

              case "starts_with":
                params[paramName] = value;
                return `${field} LIKE @${paramName} + '%'`;

              case "ends_with":
                params[paramName] = value;
                return `${field} LIKE '%' + @${paramName}`;

              case "in":
                if (_.isArray(value)) {
                  const paramNames = value.map((v, _i) => {
                    const pName = getParamName(`${field}_in`);
                    params[pName] = v;
                    return `@${pName}`;
                  });
                  return `${field} IN (${paramNames.join(", ")})`;
                }
                params[paramName] = value;
                return `${field} = @${paramName}`;

              case "not_in":
                if (_.isArray(value)) {
                  const paramNames = value.map((v, _i) => {
                    const pName = getParamName(`${field}_not_in`);
                    params[pName] = v;
                    return `@${pName}`;
                  });
                  return `${field} NOT IN (${paramNames.join(", ")})`;
                }
                params[paramName] = value;
                return `${field} != @${paramName}`;

              default:
                return "";
            }
          })
          .filter((clause) => clause !== "");

        if (conditionClauses.length > 0) {
          const operator = advancedFilters.operator || "AND";
          whereClauses.push(`(${conditionClauses.join(` ${operator} `)})`);
        }
      }

      // Apply WHERE clauses
      if (whereClauses.length > 0) {
        sqlQuery += ` WHERE ${whereClauses.join(" AND ")}`;
      }

      // Add sorting and pagination
      if (advancedFilters.sort_by) {
        const sortOrder = advancedFilters.sort_order || "desc";
        sqlQuery += ` ORDER BY ${
          advancedFilters.sort_by
        } ${sortOrder.toUpperCase()}`;
      }
      const DEFAULT_LIMIT = WEB_HISTORY_FILTER_LIMIT;
      const MIN_LIMIT = 1;
      const MAX_LIMIT = WEB_HISTORY_FILTER_LIMIT;
      const limit = Math.min(
        Math.max(advancedFilters.limit ?? DEFAULT_LIMIT, MIN_LIMIT),
        MAX_LIMIT
      );
      const offset = advancedFilters.offset || 0;
      if (!advancedFilters.sort_by) {
        sqlQuery += ` ORDER BY created_at ASC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
      } else {
        sqlQuery += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
      }

      const result = await query<IWebHistory>(sqlQuery, params);
      const finalResponse = {
        records: result.recordset,
        total: result.recordset.length,
        limit,
        offset,
      };
      return ServiceResponse.success(
        "History records fetched successfully",
        finalResponse
      );
    } catch (error) {
      console.error("Error fetching web history:", error);
      return ServiceResponse.failure(
        "Internal server error while fetching web history",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const webHistoryService = new WebHistoryService();
