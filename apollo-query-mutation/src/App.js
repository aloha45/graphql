import React from 'react'
import ApolloClient from 'apollo-boost'
import Cars from './Cars'
import Cars2 from './Cars2'
import CarsQuery from './CarsQuery'
import CarsRefetch from './CarsRefetch'
import CarsMutation from './CarsMutation'
import CarsMutationComponent from './CarsMutationComponent'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

const App = () => {
  return ( 
    <ApolloProvider client={client}>
      <Cars />
      <Cars2 />
      <CarsQuery />
      <CarsRefetch />
      <CarsMutation />
      <CarsMutationComponent />
    </ApolloProvider>
   );
}
 
export default App;
