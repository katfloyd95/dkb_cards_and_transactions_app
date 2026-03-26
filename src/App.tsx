import "./App.css";
import styled from "styled-components";
import Header from "./components/Header";
import CardList from "./components/CardList/CardList";
import TransactionList from "./components/TransactionList/TransactionList";

function App() {
  return (
    <AppContainer>
      <Header />
      <CardList />
      <TransactionList />
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.main`
  text-align: center;
`;
