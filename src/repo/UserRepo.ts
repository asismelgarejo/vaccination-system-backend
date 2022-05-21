import bycript from "bcryptjs";
import { isEmailValid } from "../common/validators/EmailValidator";
import { isPasswordValid } from "../common/validators/PasswordValidator";
import { Citizen } from "./Citizen";
import { User } from "./User";

const saltRounds = 10;

export class UserResult {
  constructor(public messages?: Array<string>, public user?: User) {}
}

// export const register = async (email: string, password: string): Promise<UserResult> => {
//   const

// }

interface IRegisterInput {
  email: string;
  password: string;
  citizen_dni: string;
}

export const register = async ({
  email,
  password,
  citizen_dni,
}: IRegisterInput): Promise<UserResult> => {
  const citizen = await Citizen.findOne({ where: { dni: citizen_dni } });
  const result = isPasswordValid(password);
  if (!result.isValid) {
    return { messages: ["Invalid password"] };
  }
  const trimmedEmail = email.trim().toLowerCase();
  const emailErrMgs = isEmailValid(trimmedEmail);
  if (emailErrMgs) {
    return { messages: [emailErrMgs] };
  }
  const salt = await bycript.genSalt(saltRounds);
  const hashedPassword = await bycript.hash(password, salt);
  const userEntity = await User.create({
    email: trimmedEmail,
    password: hashedPassword,
    citizen: citizen,
  }).save();
  userEntity.password = "";
  return { user: userEntity };
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserResult> => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { messages: [`User with email ${email} not found`] };
  }
  const passwordMatch = await bycript.compare(password, user?.password);
  if (!passwordMatch) {
    return { messages: ["Password is invalid"] };
  }
  return { user };
};

export const logout = async (email: string): Promise<UserResult> => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { messages: [`$User with email ${email} not found`] };
  }
  return { user };
};

export const me = async (id: string): Promise<UserResult> => {
  const user = await User.findOne({ where: { id }, relations: ["citizen"] });
  if (!user) {
    return { messages: ["User not found"] };
  }
  return { user };
};
