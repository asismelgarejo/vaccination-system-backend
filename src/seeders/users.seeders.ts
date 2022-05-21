import { register } from "../repo/UserRepo";
import { createConnection } from "typeorm";

const USERS = [
  {
    email: "user01@gmail.com",
    password: "user01_password",
    citizen_dni: "75958725",
  },
  {
    email: "user02@gmail.com",
    password: "user02_password",
    citizen_dni: "75958726",
  },
  {
    email: "user03@gmail.com",
    password: "user03_password",
    citizen_dni: "75958727",
  },
];

const insertUsers = async () => {
  await createConnection();
  const promises = USERS.map(({ email, password, citizen_dni }) => {
    return register({ email, password, citizen_dni });
  });
  await Promise.all(promises);
  console.log("Users inserted successfully!");
};
insertUsers();
