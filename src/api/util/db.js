export const DB_SCHEMA = process.env.DB_SCHEMA || "pet_portraits";
export const t = (table) => `${DB_SCHEMA}.${table}`;