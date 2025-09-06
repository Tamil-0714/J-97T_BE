import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
    MS_SQL_DB_PASS:str({desc:"MS SQL connection password"}),
    MS_SQL_DB_USER:str({desc:"MS SQL User"}),
    MS_SQL_DB_NAME:str({desc:"MS SQL Database name"}),
    MS_SQL_DB_SERVER:str({desc:"MS SQL Database name"}),
    SECRET_TOKEN: str({desc: "Token used to validate the request"})
});
