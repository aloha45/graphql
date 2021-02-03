const { ApolloServer, gql } = require('apollo-server')
const { makeExecutableSchema, mergeSchemas } = require('graphql-tools')
const { merge } = require('lodash')
const { RESTDataSource } = require('apollo-datasource-rest')
const express = require('express')

class CarDataAPI extends RESTDataSource {
    async getCar() {
        const data = await this.get('http://localhost:5000/carData')
        return data
    }
}

// create a memory db
const db = {
    cars: [
        {
            id: 'a',
            brand: 'Ford',
            color: 'Blue',
            doors: 4,
            type: 'Sedan'
        },{
            id: 'b',
            brand: 'Tesla',
            color: 'Red',
            doors: 4,
            type: 'SUV'
        }, {
            id: 'c',
            brand: 'Toyota',
            color: 'White',
            doors: 2,
            type: 'Coupe'
        }, {
            id: 'd',
            brand: 'GMC',
            color: 'green',
            doors: 4,
            type: 'SUV'
        }
    ]
}

// create the schema

const carEnum = `
enum CarTypes {
    Sedan
    SUV
    Coupe
}`

const carType = `
    type Car {
        id: ID!
        brand: String!
        color: String!
        doors: Int!
        type: CarTypes!
    }`

const carQueries = `
    type Query {
        carsById(id: ID!): Car
        carsByType(type: CarTypes!): [Car]
    }
    type Mutation {
        insertCar(brand: String!, color: String!, doors: Int!, type: CarTypes!): [Car]
    }`

// resolver map
const carResolverQueries = {
    Query: {
        carsByType: (parent, args, context, info) => {
            return db.cars.filter(car => car.type === args.type)
        }, 
        carsById: (parent, args, context, info) => {
            return db.cars.filter(car => cars.id === args.id)[0]
        }
    }
}
const carResolversMutations = {
    Mutation : {
        insertCar: (__, {brand, color, doors, type}) => {
            db.cars.push({
                id: Math.random().toString(),
                brand: brand,
                color: color,
                doors: doors,
                type: type
            })
            return db.cars
        }
    }
}

//execute query

const executeQuery = async () => {
    const mutation = `
    mutation {
        insertCar(brand: "Nissan", color: "Black", doors: 4, type: SUV){
            brand
            color
            id
            type
        }
    }`
    const responseThree = await graphql( schema, mutation, resolvers() )
    console.log(responseThree.data)
    const mutationWithVariables =`
    mutation insertCar($brand: String!, $color: String!, $doors: Int!, $type: CarTypes!) {
        insertCar(brand: $brand, color: $color, doors: $doors, type: $type){
            brand
            color
            id
        }
    }
    `
    const responseFour = await graphql(
        schema,
        mutationWithVariables,
        resolvers(),
        null,
        {
            brand: "Hyundai",
            color: "silver",
            doors: 4,
            type: "Sedan"
        }
    )
    console.log(responseFour.data)
}

const dbConnection = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(db)
        }, 2000)
    })
}

// merge schemas
const carSchema = makeExecutableSchema({
    typeDefs: [carQueries, carEnum, carType],
    resolvers: merge(carResolverQueries, carResolversMutations)
})

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    dataSources: () => {
        return {
            carDataAPI: new CarDataAPI()
        }
    },
    context: async () => {
        return{ db: await dbConnection() }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})

const app = express()
app.get('/carData', function(req, res) {
    res.send({
        id: 'x',
        brand: 'Suzuki',
        color: 'Blue',
        doors: 4,
        type: 'Sedan'
    })
})

app.listen(5000)