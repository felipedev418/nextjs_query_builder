import { Data, Query } from "./types";

const transformValue = (data: any, type: string) => {
  switch (type) {
    case "date":
      return new Date(data).getTime();
    default:
      return data;
  }
};

const checkType = (field: string) => {
  if (field === "birthdate") return "date";
  return "";
};

const applyFilter = (data: Array<any>, rule: any) => {
  if (!rule) return data;

  const { field, operator, value } = rule;
  switch (operator) {
    case "=":
      return data.filter(
        (item) =>
          transformValue(item[field], checkType(field)) ===
          transformValue(value, checkType(field))
      );
    case "!=":
      return data.filter(
        (item) =>
          transformValue(item[field], checkType(field)) !=
          transformValue(value, checkType(field))
      );
    case ">":
      return data.filter(
        (item) =>
          transformValue(item[field], checkType(field)) >
          transformValue(value, checkType(field))
      );
    case ">=":
      return data.filter(
        (item) =>
          transformValue(item[field], checkType(field)) >=
          transformValue(value, checkType(field))
      );
    case "<":
      return data.filter(
        (item) =>
          transformValue(item[field], checkType(field)) <
          transformValue(value, checkType(field))
      );
    case "<=":
      return data.filter(
        (item) =>
          transformValue(item[field], checkType(field)) <=
          transformValue(value, checkType(field))
      );
    case "contains":
      return data.filter((item) => item[field].includes(value));
    case "begins with":
      return data.filter((item) => item[field].startsWith(value));
    case "ends with":
      return data.filter((item) => item[field].endsWith(value));
    case "does not contain":
      return data.filter((item) => !item[field].includes(value));
    case "does not begin with":
      return data.filter((item) => !item[field].startsWith(value));
    case "does not end with":
      return data.filter((item) => !item[field].endsWith(value));
    default:
      return data;
  }
};

export const applyQuery = (data: Data[], query: Query) => {
  if (!query || !query.combinator || !query.rules) return data;

  let result = query.combinator === "and" ? data.slice() : [];

  query.rules.forEach((rule: any) => {
    if (rule.combinator) {
      if (query.combinator === "and") {
        result = applyQuery(result, rule);
      } else {
        result = [
          ...result,
          ...applyQuery(data, rule).filter((item) => !result.includes(item)),
        ];
      }
    } else {
      if (query.combinator === "and") {
        result = applyFilter(result, rule);
      } else {
        const filtered = applyFilter(data, rule);
        result = [
          ...result,
          ...filtered.filter((item) => !result.includes(item)),
        ];
      }
    }
  });
  if (query.rules.length) return result;
  return data;
};
