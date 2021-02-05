import React from 'react'
import ApolloClient from 'apollo-boost'
import Cars from './Cars'
import Cars2 from './Cars2'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

const App = () => {
  return ( 
    <ApolloProvider client={client}>
      <Cars />
      <Cars2 />
    </ApolloProvider>
   );
}
 
export default App;
