import { Router } from "express";
import knex from "../server";
const router = Router();

/* async function functionRouter(module, req, res) {
  module.default(
    prisma,
    req.body,
    function (data) {
      res.status(200).json({
        status: "success",
        data,
      });
    },
    function (error) {
      res.status(200).json({
        status: "error",
        error,
      });
    }
  );
} */

router.route("/:apid").post((req, res) => {
  const apid = req.params.apid;
  console.log("api id", apid);

  import(`../controllers/api/${apid}`)
    .then((module) => {
      // functionRouter(module, req, res);
      module.default(req, res);
    })
    .catch((err) => console.log("This API doesn't exist ⚠⚠⚠", err));
});

export default router;
