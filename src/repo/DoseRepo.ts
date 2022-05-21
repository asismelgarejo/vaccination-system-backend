import { Dose } from "./Dose";

export const getAllDoses = async (): Promise<{ doses: Dose[] }> => {
  const doses = await Dose.find();
  return { doses };
};