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
  rFactorIds,
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
  const riskFactors = await RiskFactor.find({
    where: { code: In(rFactorIds) },
  });
  const vaccine = await Vaccine.create({
    ref_cel_number,
    fc_dosis,
    user,
    vc,
    dose,
    citizen,
    riskFactors,
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
    .orderBy({ "citizen.dni": "ASC" })
    .getMany();
  if (!vaccines) {
    return { messages: ["An error occurred retrieving vaccines"] };
  }
  return { entities: vaccines };
};

export interface IDataStats {
  women: {
    minors: number;
    adults: number;
  };
  men: {
    minors: number;
    adults: number;
  };
}

export interface IStatsResult {
  stats: IDataStats;
  messages?: string;
}

export const getVcdCtzsStats = async (): Promise<IStatsResult> => {
  const eighteenAgo = () => {
    const currentDay = new Date();
    currentDay.setFullYear(currentDay.getFullYear() - 18);
    return currentDay;
  };
  function getUniqueListBy(arr: Vaccine[], key: any) {
    const citizens = arr.map((vac) => vac.citizen);
    return [
      ...new Map(citizens.map((item: any) => [item[key], item])).values(),
    ];
  }
  let men_adult = await Vaccine.createQueryBuilder("vaccine")
    .leftJoinAndSelect("vaccine.citizen", "citizen")
    .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
      gender: "M",
      eighteenAgo: eighteenAgo(),
    })
    .getMany();

  let men_minor = await Vaccine.createQueryBuilder("vaccine")
    .leftJoinAndSelect("vaccine.citizen", "citizen")
    .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
      gender: "M",
      eighteenAgo: eighteenAgo(),
    })
    .getMany();
  let women_adult = await Vaccine.createQueryBuilder("vaccine")
    .leftJoinAndSelect("vaccine.citizen", "citizen")
    .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
      gender: "F",
      eighteenAgo: eighteenAgo(),
    })
    .getMany();
  let women_minor = await Vaccine.createQueryBuilder("vaccine")
    .leftJoinAndSelect("vaccine.citizen", "citizen")
    .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
      gender: "F",
      eighteenAgo: eighteenAgo(),
    })
    .getMany();
  if (!men_adult || !men_minor || !women_adult || !women_minor) {
    return {
      messages: "An error occurred retrieving vaccines",
      stats: {
        women: {
          minors: 0,
          adults: 0,
        },
        men: {
          minors: 0,
          adults: 0,
        },
      },
    };
  }
  men_adult = getUniqueListBy(men_adult, "dni");
  men_minor = getUniqueListBy(men_minor, "dni");
  women_adult = getUniqueListBy(women_adult, "dni");
  women_minor = getUniqueListBy(women_minor, "dni");

  return {
    stats: {
      women: { minors: women_minor.length, adults: women_adult.length },
      men: { minors: men_minor.length, adults: men_adult.length },
    },
  };
};
// const eighteenAgo = () => {
//   const currentDay = new Date();
//   currentDay.setFullYear(currentDay.getFullYear() - 18);
//   return currentDay;
// };
// function getUniqueListBy(arr: Vaccine[], key: any) {
//   return [...new Map(arr.map((item: any) => [item[key], item])).values()];
// }

// let men_adult = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
//     gender: "M",
//     eighteenAgo: eighteenAgo(),
//   })
//   .getMany();

// let men_minor = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
//     gender: "M",
//     eighteenAgo: eighteenAgo(),
//   })
//   .getMany();
// let women_adult = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
//     gender: "F",
//     eighteenAgo: eighteenAgo(),
//   })
//   .getMany();
// let women_minor = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
//     gender: "F",
//     eighteenAgo: eighteenAgo(),
//   })
//   .getMany();
// if (!men_adult || !men_minor || !women_adult || !women_minor) {
//   return {
//     messages: "An error occurred retrieving vaccines",
//     stats: {
//       women: {
//         minors: 0,
//         adults: 0,
//       },
//       men: {
//         minors: 0,
//         adults: 0,
//       },
//     },
//   };
// }
// men_adult = getUniqueListBy(men_adult, "dni");
// men_minor = getUniqueListBy(men_minor, "dni");
// women_adult = getUniqueListBy(women_adult, "dni");
// women_minor = getUniqueListBy(women_minor, "dni");

// const eighteenAgo = () => {
//   const currentDay = new Date();
//   currentDay.setFullYear(currentDay.getFullYear() - 18);
//   return currentDay;
// };

// const men_adult = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
//     gender: "M",
//     eighteenAgo: eighteenAgo(),
//   })
//   .addGroupBy("citizen")
//   .getCount();
// const men_minor = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
//     gender: "M",
//     eighteenAgo: eighteenAgo(),
//   })
//   .addSelect("GROUP BY citizen.id")
//   .groupBy("citizen.dni")
//   .getCount();
// const women_adult = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday <= :eighteenAgo", {
//     gender: "F",
//     eighteenAgo: eighteenAgo(),
//   })
//   .groupBy("citizen.dni")
//   .getCount();
// const women_minor = await Vaccine.createQueryBuilder("vaccine")
//   .leftJoinAndSelect("vaccine.citizen", "citizen")
//   .where("citizen.gender =:gender AND citizen.birthday > :eighteenAgo", {
//     gender: "F",
//     eighteenAgo: eighteenAgo(),
//   })
//   .groupBy("citizen.dni")
//   .getCount();
