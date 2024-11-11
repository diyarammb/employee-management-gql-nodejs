const bcrypt = require("bcryptjs");
const jwtProvider = require("../config/jwtProvider");
const User = require("../models/User");
const Employee = require("../models/employee");

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error("Password hashing failed");
  }
};

const resolvers = {
  Query: {
    employees: async (
      _,
      { filter, page = 1, pageSize = 10, sortBy = "name" }
    ) => {
      const employees = await Employee.find({
        name: new RegExp(filter || "", "i")
      })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort(sortBy);
      return employees;
    },
    employee: async (_, { id }) => {
      return await Employee.findById(id);
    }
  },

  Mutation: {
    register: async (_, { username, email, password, role }) => {
      try {
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
          role
        });

        const token = jwtProvider.generateToken({
          id: user._id,
          email: user.email,
          role: user.role
        });

        return {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        };
      } catch (error) {
        throw new Error(error.message || "Server error");
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Password not matched");
        }

        const token = jwtProvider.generateToken({
          id: user._id,
          email: user.email,
          role: user.role
        });

        return {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        };
      } catch (error) {
        throw new Error(error.message || "Server error");
      }
    },

    addEmployee: async (
      _,
      { name, age, class: className, subjects, attendance },
      context
    ) => {
      if (!context.user || context.user.role !== "admin") {
        throw new Error("You are not authorized to perform this action.");
      }

      const employee = new Employee({
        name,
        age,
        class: className,
        subjects,
        attendance
      });
      await employee.save();
      return employee;
    },

    updateEmployee: async (
      _,
      { id, name, age, class: className, subjects, attendance }
    ) => {
      const employee = await Employee.findByIdAndUpdate(
        id,
        { name, age, class: className, subjects, attendance },
        { new: true }
      );
      return employee;
    }
  }
};

module.exports = resolvers;
