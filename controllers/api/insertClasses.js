async function insertClasses(prisma, req, res) {
  const data = req.body;
  console.log(data);
  await prisma.edu_class.create({
    data: {
      value,
    },
  });
  // await prisma.edu_student.deleteMany();

  const allStudents = await prisma.edu_student.findMany();
  console.log("insertClasses", allStudents);
  res.status(200).json({ students: allStudents });
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

export default insertClasses;
