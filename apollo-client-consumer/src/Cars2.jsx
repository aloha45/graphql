import React, { Component } from 'react';
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'

class Cars extends Component {
    constructor (props){
        super(props)
        this.state = {}
        this.loadData = this.loadData.bind(this)
    }


    async loadData(id) {
        const cars = await this.props.client.query({
            query: gql`
                query CarsById($id: ID!) {
                    carsById(id: $id) {
                        brand
                    }
                }
            `,
            variables: id
        })
        this.setState({
            carsById: cars.data.carsById,
            loading: cars.loading
        })
    }
    
    // async loadData() {
    //     const cars = await this.props.client.query({
    //         query: gql`
    //         { 
    //             carsById(id: "1") {
    //                 color
    //                 brand
    //                 parts {
    //                     name
    //                 }
    //             }
    //         }
    //         `
    //     })
    //     this.setState({
    //         carsById: cars.data.carsById,
    //         loading: cars.loading
    //     })
    // }

    render() { 
        if (this.state.loading) {
            return <div>Loading</div>
        }
        return (
            <>
                { this.state.carsById ? <div>{this.state.carsById.brand}</div>: null }
                <button onClick={()=> this.loadData({ id: "1" })}>Query</button>
            </>
        )
    }
}
 
export default withApollo(Cars)