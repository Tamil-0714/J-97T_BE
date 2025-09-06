import sql, { type IResult } from "mssql"
import { env } from "./config/envConfig.js";

const config: sql.config = {
  user: env.MS_SQL_DB_USER,
  password: env.MS_SQL_DB_PASS, 
  server: env.MS_SQL_DB_SERVER,
  database: env.MS_SQL_DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export async function getPool() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("Database connection failed", err);
    throw err;
  }
}

export async function query<T = any>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<IResult<T>> {
  const pool = await getPool();

  try {
    const request = pool.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value as sql.ISqlTypeFactoryWithNoParams | any);
    }

    const result = await request.query<T>(query);
    return result;
  } catch (error) {
    throw error;
  }
}