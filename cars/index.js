const { graphql, buildSchema, doTypesOverlap } = require('graphql')

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

const schema = buildSchema(`
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
    }
    type Query {
        carsByType(type:CarTypes!): [Car]
        carsById(id: ID!): Car
    }
`)

const resolvers = () => {
    const carsByType = args => {
        return db.cars.filter(car => car.type === args.type)
    }
    const carsById = args => {
        return db.cars.filter(car => car.id === args.id)[0]
    }
    return { carsByType, carsById }
}

//execute query

const executeQuery = async () => {
    const queryByType = `
    {
        carsByType(type:SUV){
            brand
            color
            type
            id
        }
    }
    `
    const queryById = `
    {
        carsById(id:"a"){
            brand
            type
            color
            id
            doors
        }
    }`
    const responseOne = await graphql( schema, queryByType, resolvers() )
    console.log(responseOne.data)
    const responseTwo = await graphql( schema, queryById, resolvers() )
    console.log(responseTwo.data)
}

executeQuery()
