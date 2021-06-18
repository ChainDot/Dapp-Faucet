import React, { createContext } from "react";
import Dapp from "./Dapp";
import { useContract } from "web3-hooks";
import { FroggiesAddress, FroggiesAbi } from "./contracts/Froggies";
import { FaucetAddress, FaucetAbi } from "./contracts/Faucet";

export const FroggiesContext = createContext(null);
export const FaucetContext = createContext(null);

function App() {
  const froggies = useContract(FroggiesAddress, FroggiesAbi);
  const faucet = useContract(FaucetAddress, FaucetAbi);
  return (
    <FroggiesContext.Provider value={froggies}>
      <FaucetContext.Provider value={faucet}>
        <Dapp />
      </FaucetContext.Provider>
    </FroggiesContext.Provider>
  );
}

export default App;
