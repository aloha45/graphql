import React, { Component } from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'

class Cars extends Component {
    constructor(props) {
        super(props)
        this.state = {
            insertCar: {}
        }
        this.mutation = this.mutation.bind(this)
    }

    async mutation () {
        const cars = await this.props.client.mutate({
            mutation: gql`
                mutation InsertCar(
                    $brand: String!
                    $color: String!
                    $doors: Int!
                    $type: CarTypes!
                ) {
                    insertCar(brand: $brand, color: $color, doors: $doors, type: $type) {
                        brand
                        color
                        id
                    }
                }
            `,
            variables: {
                brand: 'Honda',
                color: 'red',
                doors: 4,
                type: 'SUV'
            }
        })
        this.setState({ insertCar: cars.data.insertCar })
    }

    componentDidMount() {
        this.mutation()
    }
    render() { 
        return ( 
            <div>
                {this.state.insertCar.brand} {this.state.insertCar.id}
            </div>
         );
    }
}
 
export default withApollo(Cars);