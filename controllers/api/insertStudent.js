import { v4 as uuidv4 } from "uuid";

async function insertStudent(req, res) {
  const data = req.body;
  // console.log(data);
  await knex("edu_student").insert({ ...data, id: uuidv4() });

  const newStudent = await knex("edu_student").where({ email: data.email });
  // console.log("insertStudent", allStudents);
  res.status(200).json({ student: newStudent });
}

export default insertStudent;
