'use strict'

const humps = require('humps')

module.exports = pgPool => {
  return {
    async addCareer (name) {
      const res = await pgPool.query(`insert into careers(name) values ($1) 
        returning *`, [name])

      const career = humps.camelizeKeys(res.rows[0])
      return career
    },

    async addStudent (email, username, careerId) {
      const res = await pgPool.query(`insert into students(email, username, career_id) 
      values ($1, $2, $3) returning *`, [email, username, careerId])

      const student = humps.camelizeKeys(res.rows[0])
      return student
    },

    async getCareerById (id) {
      const res = await pgPool.query(`select * from careers where id = $1`, [id])

      const career = humps.camelizeKeys(res.rows[0])
      return career
    },

    async getStudentById (id) {
      const res = await pgPool.query(`select * from students where id = $1`, [id])

      const career = humps.camelizeKeys(res.rows[0])
      return career
    },

    async getStudentsByCareerId (id) {
      const res = await pgPool.query(`select * from students where career_id = $1`, [id])

      const career = humps.camelizeKeys(res.rows)
      return career
    },

    async getAllCareers () {
      const res = await pgPool.query(`select * from careers`)

      const careers = humps.camelizeKeys(res.rows)
      return careers
    },

    async getAllStudents () {
      const res = await pgPool.query(`select * from students`)

      const students = humps.camelizeKeys(res.rows)
      return students
    }

  }
}
