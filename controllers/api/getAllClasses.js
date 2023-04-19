async function getAllClasses(prisma, req, res) {
  const data = req.body;

  // await prisma.edu_student.deleteMany();

  const classes = await prisma.edu_class.findMany();
  console.log("getAllClasses", classes);
  res.status(200).json({ parents: classes });
}

// export default getAllClasses;
