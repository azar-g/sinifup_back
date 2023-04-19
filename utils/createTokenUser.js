const createTokenUser = (user) => {
  console.log(user);
  return { name: user.USERNAME, userId: user.ID };
};

export default createTokenUser;
