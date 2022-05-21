import { RiskFactor } from "./RiskFactor";

export const getAllRFs = async (): Promise<{ rfs: RiskFactor[] }> => {
  const rfs = await RiskFactor.find();
  return { rfs };
};
