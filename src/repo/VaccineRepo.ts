import { In } from "typeorm";
import { Citizen } from "./Citizen";
import { Dose } from "./Dose";
import { QueryArrayResult } from "./QueryArrayResult";
import { RiskFactor } from "./RiskFactor";
import { User } from "./User";
import { VaccinationCenter } from "./VaccinationCenter";
import { Vaccine } from "./Vaccine";

interface IVaccinne {
  userId: string;
  doseId: string;
  vcId: string;
  citizenId: string;
  ref_cel_number: string;
  fc_dosis: Date;
  rFactorIds: string[];
}

export const registerVaccine = async ({
  userId,
  doseId,
  vcId,
  citizenId,
  ref_cel_number,
  fc_dosis,
  rFactorIds
}: IVaccinne): Promise<QueryArrayResult<Vaccine>> => {
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return { messages: ["User not logged in."] };
  }
  const vc = await VaccinationCenter.findOne({ where: { id: vcId } });
  if (!vc) {
    return { messages: ["Vaccination center not found."] };
  }
  const dose = await Dose.findOne({ where: { id: doseId } });
  if (!dose) {
    return { messages: ["Dose not found."] };
  }
  const citizen = await Citizen.findOne({ where: { id: citizenId } });
  if (!citizen) {
    return { messages: ["Citizen not found."] };
  }
  const riskFactors = await RiskFactor.find({ where: { id: In(rFactorIds) }})
  const vaccine = await Vaccine.create({
    ref_cel_number,
    fc_dosis,
    user,
    vc,
    dose,
    citizen,
    riskFactors
  }).save();
  if (!vaccine) {
    return { messages: ["Failed to register vaccine."] };
  }
  return { messages: ["Vaccine registered successfully."] };
};
export const getVaccinesByCitizenId = async ({
  citizenId,
}: {
  citizenId: string;
}): Promise<QueryArrayResult<Vaccine>> => {
  const vaccines = await Vaccine.createQueryBuilder("vaccine")
    .where(`vaccine."citizenId" = :citizenId`, { citizenId })
    .leftJoinAndSelect("vaccine.citizen", "citizen")
    .orderBy("vaccine.fc_dosis", "ASC")
    .getMany();
  if (!vaccines) {
    return { messages: ["Vaccines of citizen not found"] };
  }

  return { entities: vaccines };
};

export const getAllVaccines = async (): Promise<QueryArrayResult<Vaccine>> => {
  const vaccines = await Vaccine.createQueryBuilder("vaccine")
    .leftJoinAndSelect("vaccine.citizen", "citizen")
    .leftJoinAndSelect("vaccine.riskFactors", "riskFactors")
    .leftJoinAndSelect("vaccine.dose", "dose")
    .leftJoinAndSelect("vaccine.vc", "vc")
    .orderBy({ "citizen.fr_lastname": "ASC" })
    .getMany();
  if (!vaccines) {
    return { messages: ["An error occurred retrieving vaccines"] };
  }
  return { entities: vaccines };
};
