'use strict'

const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const pg = require('pg')
const root = require('./schema/resolvers')
const FormatError = require('easygraphql-format-error')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: 'development.env' })
}

const pgPool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

const app = express()

app.set('port', process.env.PORT || 7000)
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({ extended: true }))

const formatError = new FormatError()
const errorName = formatError.errorName

const schemaCode = fs.readFileSync(path.join(__dirname, 'schema', 'schema.gql'), 'utf8')
const schema = buildSchema(schemaCode)

app.use('/graphql', (req, res) => {
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
    context: { pgPool, req, errorName },
    formatError: (err) => {
      return formatError.getError(err)
    }
  })(req, res)
})

const server = app.listen(app.get('port'), () => {
  console.log(`Server running -> PORT ${server.address().port}`)
})

module.exports = app
