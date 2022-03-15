import web3 from "./web3";
import lottery from "./lottery";
import { useEffect, useState } from "react";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState();
  const [message, setMessage] = useState();
  useEffect(() => {
    const fetchManager = async () => {
      await lottery.methods
        .manager()
        .call()
        .then((result) => setManager(result));
      await lottery.methods
        .getPlayers()
        .call()
        .then((result) => setPlayers(result));
      await web3.eth
        .getBalance(lottery.options.address)
        .then((result) => setBalance(result));
    };
    fetchManager();
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    const account = await web3.eth.getAccounts();
    setMessage("Message: 'Waiting for the transaction to complete'");
    await lottery.methods.enter().send({
      from: account[0],
      value: web3.utils.toWei(value, "ether"),
    });
    setMessage("Message: 'The transaction is completed.'");
  };

  const onClick = async (event) => {
    setMessage("Message: 'Waiting for the transaction to complete'");
    const account = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: account[0],
    });
    setMessage("Message: 'A winner has been picked.'");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p> This contract is managed by {manager}</p>
      <p>
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={submitForm}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
        </div>
        <button> Enter </button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
