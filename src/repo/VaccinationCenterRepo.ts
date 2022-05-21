import { VaccinationCenter } from "./VaccinationCenter";

export const getAllVCs = async (): Promise<{ vcs: VaccinationCenter[] }> => {
  const vcs = await VaccinationCenter.find();
  return { vcs };
};