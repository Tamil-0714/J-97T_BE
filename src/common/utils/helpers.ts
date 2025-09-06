import _ from "lodash";

export function isTruthyValue(val: any): boolean {
  if (val === null || val === undefined) return false;

  if (typeof val === "string" && val.trim() === "") return false;

  if (typeof val === "number" || typeof val === "boolean") return true;

  if (_.isEmpty(val) && !(val instanceof Date)) return false;

  return true;
}