import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost'
import Cars from './Cars'
import Provider from './Provider'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

const App = () => {
  return ( 
    <Provider client={client}>
      <Cars />
    </Provider>
   );
}
 
export default App;
