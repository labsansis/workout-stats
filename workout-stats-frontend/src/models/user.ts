export type UserCoreInfo = {
  name: string;
  email: string;
  id: string;
};

export type UserSupplementalInfo = {
  preferredUnits?: "metric" | "imperial";
};

export type User = UserCoreInfo & UserSupplementalInfo;
