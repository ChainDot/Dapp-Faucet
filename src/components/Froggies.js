import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";

import React, { useContext, useState } from "react";
import { Web3Context } from "web3-hooks";
import { FroggiesContext } from "../App";

const Froggies = () => {
  const toast = useToast();
  const DECIMALS = 10 ** 18;
  const [web3State] = useContext(Web3Context);
  const froggies = useContext(FroggiesContext);
  const [supply, setSupply] = useState("");
  const [balance, setBalance] = useState("");
  const [addressBalanceOf, setAddressBalanceOf] = useState("");
  const [loading, setLoading] = useState(false);
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [spender, setSpender] = useState("");
  const [owner, setOwner] = useState("");
  const [amount, setAmount] = useState("");

  // Transfer
  const handleTransferClick = async () => {
    try {
      setLoading(true);
      let tx = await froggies.transfer(
        recipient,
        (amount * DECIMALS).toString()
      );
      await tx.wait();
      toast({
        title: "Confirmed transaction",
        description: `Transfer from ${web3State.account} to recipient ${recipient} for a value of: ${amount} FRG\nTransaction hash: ${tx.hash}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      if (e.code === 4001) {
        toast({
          title: "Transaction signature denied",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // TransferFrom
  const handleTransferFromClick = async () => {
    try {
      setLoading(true);
      let tx = await froggies.transferFrom(
        sender,
        recipient,
        (amount * DECIMALS).toString()
      );
      await tx.wait();
      toast({
        title: "Confirmed transaction",
        description: `Transfer from ${sender} to recipient ${recipient} for a value of: ${amount} FRG\nTransaction hash: ${tx.hash}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      if (e.code === 4001) {
        toast({
          title: "Transaction signature denied",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      if (e.code === -32603) {
        toast({
          title: "Unsufficient Allowance",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // Approve
  const handleApproveClick = async () => {
    try {
      setLoading(true);
      let tx = await froggies.approve(spender, (amount * DECIMALS).toString());
      await tx.wait();
      toast({
        title: "Confirmed transaction",
        description: `Approve ${web3State.account} to spender ${spender} for a value of: ${amount} FRG\nTransaction hash: ${tx.hash}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      if (e.code === 4001) {
        toast({
          title: "Transaction signature denied",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // Allowance
  const handleAllowanceClick = async () => {
    try {
      setLoading(true);
      let tx = await froggies.allowance(owner, spender);
      await tx.wait();
      toast({
        title: "Confirmed transaction",
        description: `Allowance owner ${owner} to spender ${spender} \nTransaction hash: ${tx.hash}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      if (e.code === 4001) {
        toast({
          title: "Transaction signature denied",
          description: e.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // Getters

  const handleSupplyClick = async () => {
    try {
      const tx = await froggies.totalSupply();
      setSupply(tx);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBalanceOfClick = async () => {
    try {
      const tx = await froggies.balanceOf(addressBalanceOf);
      setBalance(tx);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddressChange = (e) => {
    setAddressBalanceOf(e.target.value);
  };

  return (
    <>
      <Flex direction="column">
        <Flex>
          <Box>
            <FormLabel>Transfer</FormLabel>
            <Input
              placeholder="Recipient address"
              border="greenyellow"
              onChange={(e) => setRecipient(e.target.value)}
              value={recipient}
            />
            <Input
              placeholder="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
              >
                Send
              </Button>
            ) : (
              <Button
                mb="8px"
                colorScheme="green"
                onClick={handleTransferClick}
              >
                Send
              </Button>
            )}
          </Box>
        </Flex>
        <Flex>
          <Box>
            <FormLabel>TransferFrom</FormLabel>
            <Input
              placeholder="Sender address"
              onChange={(e) => setSender(e.target.value)}
              value={sender}
            />
            <Input
              placeholder="Recipient address"
              onChange={(e) => setRecipient(e.target.value)}
              value={recipient}
            />
            <Input
              placeholder="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />

            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
              >
                Send
              </Button>
            ) : (
              <Button
                mb="8px"
                colorScheme="green"
                onClick={handleTransferFromClick}
              >
                Send
              </Button>
            )}
          </Box>
        </Flex>
        <Flex>
          <Box>
            <FormLabel>Approve</FormLabel>
            <Input
              placeholder="Spender address"
              onChange={(e) => setSpender(e.target.value)}
              value={spender}
            />
            <Input
              placeholder="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
              >
                Send
              </Button>
            ) : (
              <Button mb="8px" colorScheme="green" onClick={handleApproveClick}>
                Send
              </Button>
            )}
          </Box>
        </Flex>
        <Flex>
          <Box>
            <FormLabel>Allowance</FormLabel>
            <Input
              placeholder="owner address"
              onChange={(e) => setOwner(e.target.value)}
              value={owner}
            />
            <Input
              placeholder="spender address"
              onChange={(e) => setSpender(e.target.value)}
              value={spender}
            />
            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
              >
                Send
              </Button>
            ) : (
              <Button
                mb="8px"
                colorScheme="green"
                onClick={handleAllowanceClick}
              >
                Send
              </Button>
            )}
          </Box>
        </Flex>
        <Flex align="center">
          <Button
            mb="8px"
            colorScheme="green"
            value={supply}
            onClick={handleSupplyClick}
          >
            totalSupply
          </Button>
          <Text>{supply > 0 ? `${supply / DECIMALS} FRG` : ""}</Text>
        </Flex>
        <Flex>
          <Button mb="8px" colorScheme="green" onClick={handleBalanceOfClick}>
            balanceOf
          </Button>
          <Input
            placeholder="Recipient address"
            size="sm"
            onChange={handleAddressChange}
            value={addressBalanceOf}
          />
          <Text>{balance > 0 ? `${balance / DECIMALS} Tokens` : ""}</Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Froggies;
