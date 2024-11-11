const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Attendance {
    day: String!
    present: Boolean!
  }

  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: [Attendance!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      role: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addEmployee(
      name: String!
      age: Int!
      class: String!
      subjects: [String!]!
      attendance: [AttendanceInput!]!
    ): Employee!
    updateEmployee(
      id: ID!
      name: String
      age: Int
      class: String
      subjects: [String]
      attendance: [AttendanceInput]
    ): Employee!
  }

  input AttendanceInput {
    day: String!
    present: Boolean!
  }

  type Query {
    employees(
      filter: String
      page: Int
      pageSize: Int
      sortBy: String
    ): [Employee!]!
    employee(id: ID!): Employee!
  }
`;

module.exports = typeDefs;
