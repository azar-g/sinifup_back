import knex from "../../server";

async function getAllStudents(req, res) {
  // console.log(req);
  const allStudents = await knex("edu_student");
  // console.log("getAllStudents", allStudents);
  res.status(200).json({ students: allStudents });
}

export default getAllStudents;
