import { v4 as uuidv4 } from "uuid";

async function insertParent(req, res) {
  const data = req.body;
  // console.log(data);
  await knex("edu_parent").insert({ ...data, id: uuidv4() });

  const newStudent = await knex("edu_parent").where({ email: data.email });
  res.status(200).json({ student: newStudent });
}

export default insertParent;
