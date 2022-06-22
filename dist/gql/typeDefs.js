"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
  scalar Date
  type EntityResult {
    messages: [String!]
  }
  type LogResult {
    message: String!
    status: String!
  }
  type Citizen {
    id: ID!
    dni: String!
    names: String!
    fr_lastname: String!
    mr_lastname: String!
    birthday: Date!
    gender: String!
    address: String!
    vaccines: [Vaccine!]
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }
  union CitizenResult = Citizen | EntityResult

  type User {
    id: ID!
    email: String!
    password: String!
    isDisabled: Boolean!
    vaccines: [Vaccine!]
    citizen: Citizen!
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }
  union UserResult = User | EntityResult
  type Vaccine {
    id: ID!
    ref_cel_number: String!
    fc_dosis: String!
    citizen: Citizen!
    dose: Dose!
    user: User!
    vc: VaccinationCenter!
    riskFactors: [RiskFactor!]
  }
  type VaccineArray {
    vaccines: [Vaccine!]
  }
  union VaccineArrayResult = VaccineArray | EntityResult

  type Dose {
    id: ID!
    name: String!
    vaccines: [Vaccine!]!
    code: String!
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }
  type RiskFactor {
    id: ID!
    name: String!
    code: String!
  }
  type VaccinationCenter {
    id: ID!
    name: String!
    code: String!
    vaccines: [Vaccine!]!
  }

  input getCitizenByDniInput {
    birthday: Date!
    dni: String!
  }
  input RegisterVaccineInput {
    userId: ID!
    doseId: ID!
    vcId: ID!
    citizenId: ID!
    ref_cel_number: String!
    fc_dosis: Date
    rFactorIds: [String!]
  }
  input LoginInput {
    email: String!
    password: String!
  }

  type WomenStats {
    minors: Int!
    adults: Int!
  }
  type MenStats {
    minors: Int!
    adults: Int!
  }

  type VcdCtzStats {
    women: WomenStats!
    men: MenStats!
  }

  type Query {
    getAllVaccines: [Vaccine!]
    getAllRFs: [RiskFactor!]
    getAllVCs: [VaccinationCenter!]
    getAllDoses: [Dose!]
    getVcdCtzsStats: VcdCtzStats!
    me: UserResult!
  }

  type Mutation {
    getCitizenByDni(input: getCitizenByDniInput): CitizenResult
    registerVaccine(input: RegisterVaccineInput): EntityResult
    login(input: LoginInput): LogResult
    logout(email: String!): LogResult
  }
`;
exports.default = typeDefs;
//# sourceMappingURL=typeDefs.js.map