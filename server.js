import dotenv from "dotenv";
import app from "./app.js";
import Knex from "knex";
import camelcaseKeys from "camelcase-keys";
import KnexStringcase from "knex-stringcase";
dotenv.config();

const knex = Knex(
  KnexStringcase({
    client: "mysql",
    debug: true,
    pool: {
      min: 1,
      max: 20,
    },
    postProcessResponse: (result, queryContext) => {
      if (Array.isArray(result)) {
        return result.map((row) => camelcaseKeys(row, { deep: true }));
      } else {
        return camelcaseKeys(result, { deep: true });
      }
    },

    connection: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    },
  })
);

// Add a query event hook to add the where clause for the status field
/* knex.on("query", (query) => {
  if (
    query.method === "select" &&
    !query._statements.find(({ grouping }) => grouping === "where")
  ) {
    query.where({ status: "A" });
  }
}); */

global.knex = knex;

const port = 8080;

app.listen(port, () => {
  console.log("Server is listening on port 127.0.0.1:" + port + "");
});

export default knex;
