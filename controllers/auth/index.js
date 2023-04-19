import { StatusCodes } from "http-status-codes";
// import { BadRequestError } from "../../errors/bad-request";
import UnauthenticatedError from "../../errors";
// import connection from "../../server";
import bcrypt from "bcryptjs";
import createTokenUser from "../../utils/createTokenUser";
import { createJWT } from "../../utils/jwt";
import knex from "../../server";
import { v4 as uuidv4 } from "uuid";
import { CustomAPIError } from "../../errors/custom-api";
import CustomError from "../../errors";

export const login = async (req, res) => {
  const { username, password, domain } = req.body;

  if (!username || !password || !domain) {
    throw new BadRequestError("Please provide email and password");
  }
  let user;
  let companyId;
  let companyDb;

  // find user by USERNAME in 'backlog_temp.cr_user' table
  try {
    const rows = await knex("backlog_temp.cr_user").where({
      USERNAME: username,
    });
    // console.log(rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    } else {
      user = rows[0];
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.sqlMessage });
  }
  // console.log(user);

  // compare password hash using bcrypt
  bcrypt.compare(password, user?.password, (err, result) => {
    if (err) {
      console.error("bcrypt--->>>🔴", err);
      return res.status(500).json({ error: "Internal server error" });
    } else if (result) {
      return res.status(401).json({ error: "Invalid username or password" });
    } else {
      console.log("password is ok");
    }
  });

  // find companyId by fk_user_id in 'backlog_temp.cr_user_company_rel' table
  try {
    const rows = await knex
      .from("backlog_temp.cr_user_company_rel")
      .select("fk_company_id")
      .where({
        fk_user_id: user.id,
        domain: domain,
      });
    // console.log(rows);
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "User not associated with any company" });
    } else {
      companyId = rows[0].fkCompanyId;
    }
  } catch (error) {
    return res.status(500).json({ error: error.sqlMessage });
  }

  // find company by company_id in 'company' table
  try {
    const rows = await knex
      .from("backlog_temp.cr_company")
      .select("COMPANY_DB")
      .where({
        ID: companyId,
      });
    // console.log(rows);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Company Database not found" });
    } else {
      companyDb = rows[0].companyDb;
    }
  } catch (error) {
    return res.status(500).json({ error: error.sqlMessage });
  }

  const tokenUser = createTokenUser(user);
  const token = createJWT(tokenUser);

  /* try {
    const rows = await knex("backlog_temp.cr_user_token").insert({
      fk_user_id: user.id,
      token: token,
    });
    console.log(rows);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Not inserted" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.sqlMessage });
  } */

  /* knex.schema
    .createTable("cr_user_token", (table) => {
      table.increments("id"),
        table.string("fk_user_id"),
        table.string("token"),
        table.boolean("status");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .then((res) => console.log(res)); */

  /*  knex.schema
    .createTable("cr_user_token", (table) => {
      table
        .specificType("id", "SERIAL")
        .unique()
        .primary()
        .defaultTo(knex.raw("100000000"))
        .notNullable()
        .alter();
      table.string("fk_user_id");
      table.string("token");
      table.string("status").defaultTo("A");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .then((res) => console.log(res)); */

  // return response with user_id, company_name, and token
  user &&
    res.json({
      // user,
      token,
    });
};

/* export const loginold = async (req, res) => {
  const { username, password, domain } = req.body;
  // console.log(req.body);

  if (!username || !password || !domain) {
    throw new BadRequestError("Please provide email and password");
  }
  connection.query(
    "SELECT * FROM cr_user WHERE USERNAME = ?",
    [username],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else if (rows.length === 0) {
        res.status(401).json({ error: "Invalid username or password" });
      } else {
        const user = rows[0];
        const { ID: userId, PASSWORD: userPassword } = rows[0];
        console.log("25 user--->", userId);

        // compare password hash using bcrypt

        bcrypt.compare(password, userPassword, (err, result) => {
          if (err) {
            console.error("bcrypt--->>>🔴", err);
            res.status(500).json({ error: "Internal server error" });
          } else if (result) {
            res.status(401).json({ error: "Invalid username or password" });
          } else {
            console.log("password is ok");

            connection.query(
              "SELECT fk_company_id FROM cr_user_company_rel WHERE fk_user_id = ? AND domain = ?",
              [userId, domain],
              (err, rows) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({ error: "Internal server error" });
                } else if (rows.length === 0) {
                  res
                    .status(401)
                    .json({ error: "User not associated with any company" });
                } else {
                  const companyId = rows[0].fk_company_id;
                  // console.log(rows);
                  // const relation = rows[0];
                  // console.log(companyId);

                  // find company by company_id in 'company' table
                  connection.query(
                    "SELECT COMPANY_DB FROM cr_company WHERE ID = ?",
                    [companyId],
                    (err, rows) => {
                      if (err) {
                        console.error(err);
                        res
                          .status(500)
                          .json({ error: "Internal server error" });
                      } else {
                        const companyDb = rows[0].COMPANY_DB;

                        const tokenUser = createTokenUser(user);
                        const token = createJWT(tokenUser);

                        // return response with user_id, company_name, and token
                        res.json({
                          companyDb,
                          token,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );
}; */

export const register = async (req, res) => {
  console.log(req.body);
  const { email, username, password } = req.body;

  try {
    const rows = await knex.from("backlog_temp.cr_user").where({
      EMAIL: email,
    });

    // console.log(rows);
    if (rows.length > 0) {
      throw CustomError.BadRequestError("Email already exists");
    }
  } catch (error) {
    return res.status(500).json({ error: error.sqlMessage });
  }
  // const tokenUser = createTokenUser(user);

  /* const user = await knex("backlog_temp.cr_user").insert({
    USERNAME: username,
    EMAIL: email,
    PASSWORD: password,
    id: uuidv4(),
  }); */
  // attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });

  /*  try {
    const user = await knex("backlog_temp.cr_user").insert({
      USERNAME: name,
      EMAIL: email,
      PASSWORD: password,
      id: uuidv4(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.sqlMessage });
  } */
};
