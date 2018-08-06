'use strict'

const pgdb = require('../../models')

const root = {
  createCareer: async ({ input }, { pgPool }) => {
    const { name } = input

    return pgdb(pgPool).addCareer(name)
  },

  createStudent: async ({ input }, { pgPool }) => {
    const { email, username, careerId } = input

    const student = await pgdb(pgPool).addStudent(email, username, careerId)
    student.career = await pgdb(pgPool).getCareerById(student.careerId)

    return student
  },

  geAllStudents: async (args, { pgPool }) => {
    const students = await pgdb(pgPool).getAllStudents()

    const allStudents = []
    for (let student of students) {
      student = Object.assign({}, student)
      student.career = await pgdb(pgPool).getCareerById(student.careerId)
      allStudents.push(student)
    }

    return allStudents
  },

  getAllCareers: async (args, { pgPool }) => {
    const careers = await pgdb(pgPool).getAllCareers()

    const allCareers = []
    for (let career of careers) {
      career = Object.assign({}, career)
      career.students = await pgdb(pgPool).getStudentsByCareerId(career.id)
      allCareers.push(career)
    }

    return allCareers
  },

  getStudentById: async (args, { pgPool }) => {
    const { studentId } = args

    const student = await pgdb(pgPool).getStudentById(studentId)
    student.career = await pgdb(pgPool).getCareerById(student.careerId)
    return student
  },

  getCareerById: async (args, { pgPool }) => {
    const { careerID } = args

    const career = await pgdb(pgPool).getCareerById(careerID)
    career.students = await pgdb(pgPool).getStudentsByCareerId(career.id)

    return career
  }
}

module.exports = root
