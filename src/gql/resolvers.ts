import { IResolvers } from "apollo-server-express";
import { Citizen } from "../repo/Citizen";
import { getCitizenByDni } from "../repo/CitizenRepo";
import { QueryArrayResult, QueryOneResult } from "../repo/QueryArrayResult";
import { User } from "../repo/User";
import { login, logout, me, UserResult } from "../repo/UserRepo";
import { Vaccine } from "../repo/Vaccine";
import { getAllVaccines, registerVaccine } from "../repo/VaccineRepo";
import { GqlContext } from "./GqlContext";

interface EntityResult {
  messages: string[];
}

interface ILogResult {
  status: "success" | "failure";
  message: string;
}

interface IgetCitizenByDniInput {
  birthday: Date;
  dni: string;
}
interface IRegisterVaccineInput {
  userId: string;
  doseId: string;
  vcId: string;
  citizenId: string;
  ref_cel_number: string;
  fc_dosis: Date;
  rFactorIds: string[];
}

interface ILogin {
  email: string;
  password: string;
}

const resolvers: IResolvers = {
  CitizenResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj?.messages) {
        return "EntityResult";
      }
      return "Citizen";
    },
  },
  UserResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj?.messages) {
        return "UserResult";
      }
      return "User";
    },
  },
  Query: {
    getAllVaccines: async (
      parent: any,
      args: null,
      ctx: GqlContext
    ): Promise<Vaccine[] | EntityResult> => {
      let vaccines: QueryArrayResult<Vaccine>;
      try {
        vaccines = await getAllVaccines();
        if (vaccines.entities) {
          return vaccines.entities;
        }
        return { messages: vaccines?.messages ?? [""] };
      } catch (error) {
        throw error;
      }
    },
    me: async (
      parent: any,
      args: null,
      ctx: GqlContext
    ): Promise<User | EntityResult> => {
      let user: UserResult;
      try {
        if (!ctx.req.session!.userId) {
          return { messages: ["User not logged in."] };
        }
        user = await me(ctx.req.session!.userId);
        if (user && user.user) {
          return user.user;
        }
        return {
          messages: user.messages ?? ["Error when logging"],
        };
      } catch (e) {
        throw e;
      }
    },
  },
  Mutation: {
    registerVaccine: async (
      parent: any,
      { input }: { input: IRegisterVaccineInput }
    ) => {
      let result: QueryOneResult<Vaccine>;
      try {
        result = await registerVaccine({
          userId: input.userId,
          doseId: input.doseId,
          vcId: input.vcId,
          citizenId: input.citizenId,
          ref_cel_number: input.ref_cel_number,
          fc_dosis: input?.fc_dosis ?? new Date(),
          rFactorIds: input.rFactorIds,
        });
        return { messages: result.messages ?? ["An error ocurred!"] };
      } catch (error) {
        throw error;
      }
    },
    login: async (
      parent: any,
      { input }: { input: ILogin },
      ctx: GqlContext
    ): Promise<ILogResult> => {
      try {
        const user = await login({
          email: input.email,
          password: input.password,
        });
        if (user && user?.user) {
          ctx.req.session!.userId = user.user.id;
          return {
            message: `User logged in with id ${ctx.req.session!.userId}`,
            status: "success",
          };
        }
        return {
          message: user.messages ? user.messages[0] : "Error when loggin",
          status: "failure",
        };
      } catch (error) {
        throw error;
      }
    },
    logout: async (
      parent: any,
      { email }: { email: string },
      ctx: GqlContext
    ) => {
      try {
        const result = await logout(email);
        if (result?.user) {
          ctx.req.session?.destroy((err: any) => {
            if (err) {
              return {
                status: "failure",
                message: "Destroy session failed",
              };
            } else {
              return {
                status: "success",
                message: "Session of the user was destroyed successfully.",
              };
            }
          });
          return {
            status: "success",
            message: "Session of the user was destroyed successfully.",
          };
        } else {
          return {
            status: "failure",
            message: "Failure logout",
          };
        }
      } catch (error) {
        throw error;
      }
    },
    getCitizenByDni: async (
      parent: any,
      { input: { birthday, dni } }: { input: IgetCitizenByDniInput },
      ctx: GqlContext
    ): Promise<Citizen | EntityResult> => {
      let citizen: QueryOneResult<Citizen>;
      try {
        citizen = await getCitizenByDni({ birthday, dni });
        if (citizen.entity) {
          return citizen.entity;
        } else {
          return { messages: citizen.messages ?? ["Not found"] };
        }
      } catch (err) {
        throw err;
      }
    },
  },
};

export default resolvers;
