import { register } from "../repo/UserRepo";

const USERS = [
  {
    email: "user01@gmail.com",
    password: "password",
    citizen_dni: "75958735",
  },
  {
    email: "user02@gmail.com",
    password: "password",
    citizen_dni: "75958736",
  },
  {
    email: "user03@gmail.com",
    password: "password",
    citizen_dni: "75958737",
  },
  {
    email: "user04@gmail.com",
    password: "password",
    citizen_dni: "75958738",
  },
  {
    email: "user05@gmail.com",
    password: "password",
    citizen_dni: "75958739",
  },
  {
    email: "user06@gmail.com",
    password: "password",
    citizen_dni: "75958743",
  },
];

export const insertUsers = async () => {
  // await createConnection();
  const promises = USERS.map(({ email, password, citizen_dni }) => {
    return register({ email, password, citizen_dni });
  });
  await Promise.all(promises);
  console.log("Users inserted successfully!");
};
