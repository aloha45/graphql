import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

client
  .query({
    query: gql`
      {
        carsById(id: "1") {
          color
          brand
          parts {
            name
          }
        }
      }`
    })
  .then(data => console.log(data))

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
