const { ApolloServer, gql } = require('apollo-server')
const { RESTDataSource } = require('apollo-datasource-rest')
const express = require('express')

class CarDataAPI extends RESTDataSource {
    async getCar() {
        const data = await this.get('http://localhost:5000/carData')
        return data
    }
}

// create a memory db
const cars = [
    {
        id: '1',
        brand: 'Toyota Corola',
        doors: 4,
        color: 'Blue',
        type: 'Sedan',
        parts: [{id: '1'}, {id: '2'}]
    }, {
        id: '2',
        brand: 'Toyota Camry',
        doors: 4,
        color: 'Red',
        type: 'SUV',
        parts: [ { id: '1' }, { id: '2' } ]
    }
]

const parts = [
    {
        id: '1',
        name: 'Transmission',
        cars: [{ id: '1', id: '2' }]
    }, {
        id: '2',
        name: 'Suspension',
        cars: [{ id: '1'}]
    }
]

// create the schema

const schema = gql(`
    enum CarTypes {
        Sedan
        SUV
        Coupe
    }
    type Car {
        id: ID!
        brand: String!
        color: String!
        doors: Int!
        type: CarTypes!
        parts: [Part]
    }
    type Part {
        id: ID!
        name: String!
        cars: [Car]
    }
    type Query {
        carsByType(type:CarTypes!): [Car]
        carsById(id: ID!): Car
        carsAPI: Car
        partsById(id: ID!): Part
    }
    type Mutation {
        insertCar(brand: String!, color: String!, doors: Int!, type: CarTypes!): [Car]!
    }
`)

// resolver map
const resolvers = {
    Query: {
        carsByType: (parent, args, context, info) => {
            return cars.filter(car => car.type === args.type)
        },
        carsById: (parent, args, context, info) => args,
        partsById: (parent, args, context, info) => args
    },
    Part: {
        name: (parent, args, context, info) => {
            if (parts.filter(part => part.id === parent.id)[0]){
                return parts.filter (part => part.id === parent.id)[0].name
            }
            return null
        },
        cars: (parent, args, context, info) => {
            return parts.filter(part => part.partId === parent.partId)[0].cars
        }
    },
    Car: {
        brand: (parent, args, context, info) => {
            return cars.filter(car => car.id === parent.id)[0].brand
        },
        type: (parent, args, context, info) => {
            return cars.filter(car => car.id === parent.id)[0].type
        },
        color: (parent, args, context, info) => {
            return cars.filter(car => car.id === parent.id)[0].color
        },
        doors: (parent, args, context, info) => {
            return cars.filter(car => car.id === parent.id)[0].doors
        },
        parts: (parent, args, context, info) => {
            return cars.filter(car => car.id === parent.id)[0].parts
        }
    },
    Mutation: {
        insertCar: (_, { brand, color, doors, type }) => {
            cars.push({
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

// const dbConnection = () => {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve(db)
//         }, 2000)
//     })
// }

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    // dataSources: () => {
    //     return {
    //         carDataAPI: new CarDataAPI()
    //     }
    // },
    // context: async () => {
    //     return{ db: await dbConnection() }
    // }
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