import knex from "../../server";

async function getAllParents(req, res) {
  // const data = req.body;

  // await prisma.edu_student.deleteMany();

  const allParents = await knex("edu_parent");
  res.status(200).json({ parents: allParents });
}

/* main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); */

export default getAllParents;
