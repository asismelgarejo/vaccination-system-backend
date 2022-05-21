import { Citizen } from "./Citizen";
import { QueryOneResult } from "./QueryArrayResult";

interface IGetCitizenByDni {
  dni: string;
  birthday: Date;
}

export const getCitizenByDni = async ({
  dni,
  birthday,
}: IGetCitizenByDni): Promise<QueryOneResult<Citizen>> => {
  const citizen = await Citizen.findOne({
    where: {
      dni,
      birthday,
    },
    relations: [
      "vaccines",
      "vaccines.citizen",
      "vaccines.dose",
      "vaccines.vc",
      "vaccines.riskFactors",
    ],
  });
  if (!citizen) {
    return { messages: ["User not found for this data"] };
  }
  return { entity: citizen };
};
