import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "web3-hooks";
import { FaucetContext } from "../App";

const Faucet = () => {
  const [web3State] = useContext(Web3Context);
  const faucet = useContext(FaucetContext);
  const [countdown, setCountdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleGetTokensClick = async () => {
    try {
      setIsLoading(true);
      let tx = await faucet.getTokens();
      await tx.wait();
      toast({
        title: "Confirmed transaction",
        description: `Address ${web3State.account} received 100 FRG\nTransaction hash: ${tx.hash}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      if (e.code === -32603) {
        toast({
          title: "Transaction Denied wait",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      if (e.code === 4001) {
        toast({
          title: "Transaction signature denied",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (faucet) {
      const getCountDown = async () => {
        try {
          const tx = await faucet.countdown();
          setCountdown(tx);
        } catch (e) {
          console.log(e);
        }
      };
      getCountDown();
    }
  }, [faucet]);

  //convert secondes so is more readable
  function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  return (
    <>
      {isLoading ? (
        <Button isLoading loadingText="Loading" mb="8px" colorScheme="green">
          get 100 tokens
        </Button>
      ) : (
        <Button mb="8px" colorScheme="green" onClick={handleGetTokensClick}>
          get 100 tokens
        </Button>
      )}
      <Text>
        time remaining before you can get more tokens:{" "}
        {secondsToHms(countdown).toString()}{" "}
      </Text>
    </>
  );
};

export default Faucet;
