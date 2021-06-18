import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";

import React, { useContext, useEffect, useState } from "react";
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
      toast({
        title: "Transaction signature denied",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });

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
      toast({
        title: "Transaction signature denied",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });

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
      toast({
        title: "Transaction signature denied",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error(e);
    }
  };

  const handleBalanceOfClick = async () => {
    try {
      const tx = await froggies.balanceOf(addressBalanceOf);
      setBalance(tx);
    } catch (e) {
      toast({
        title: "Transaction signature denied",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error(e);
    }
  };

  const handleAddressChange = (e) => {
    setAddressBalanceOf(e.target.value);
  };

  return (
    <>
      <Flex direction="column" m="1rem">
        <Flex>
          <Box
            borderWidth="2px"
            p="3"
            borderColor="green.400"
            borderRadius="5"
            mb="2"
            me="2"
          >
            <Text color="green.500" fontWeight="extrabold" mb="1">
              Transfer
            </Text>
            <Input
              placeholder="Recipient address"
              onChange={(e) => setRecipient(e.target.value)}
              value={recipient}
              focusBorderColor="green.400"
              mb="2"
            />
            <Input
              placeholder="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              focusBorderColor="green.400"
              mb="2"
            />
            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
                size="sm"
              >
                Send
              </Button>
            ) : (
              <Button
                mb="8px"
                colorScheme="green"
                onClick={handleTransferClick}
                size="sm"
              >
                Send
              </Button>
            )}
          </Box>
          <Box
            borderWidth="2px"
            p="3"
            borderColor="green.400"
            borderRadius="5"
            mb="2"
          >
            <Text color="green.500" fontWeight="extrabold" mb="1">
              TransferFrom
            </Text>
            <Input
              placeholder="Sender address"
              onChange={(e) => setSender(e.target.value)}
              value={sender}
              focusBorderColor="green.400"
              mb="2"
            />
            <Input
              placeholder="Recipient address"
              onChange={(e) => setRecipient(e.target.value)}
              value={recipient}
              focusBorderColor="green.400"
              mb="2"
            />
            <Input
              placeholder="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              focusBorderColor="green.400"
              mb="2"
            />

            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
                size="sm"
              >
                Send
              </Button>
            ) : (
              <Button
                mb="8px"
                colorScheme="green"
                onClick={handleTransferFromClick}
                size="sm"
              >
                Send
              </Button>
            )}
          </Box>
        </Flex>

        <Flex>
          <Box
            borderWidth="2px"
            p="3"
            borderColor="green.400"
            borderRadius="5"
            mb="2"
            me="2"
            w="100%"
          >
            <Text color="green.500" fontWeight="extrabold" mb="1">
              Approve
            </Text>
            <Input
              placeholder="Spender address"
              onChange={(e) => setSpender(e.target.value)}
              value={spender}
              focusBorderColor="green.400"
              mb="2"
            />
            <Input
              placeholder="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              focusBorderColor="green.400"
              mb="2"
            />
            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
                size="sm"
              >
                Send
              </Button>
            ) : (
              <Button
                mb="8px"
                colorScheme="green"
                onClick={handleApproveClick}
                size="sm"
              >
                Send
              </Button>
            )}
          </Box>
          <Box
            borderWidth="2px"
            p="3"
            borderColor="green.400"
            borderRadius="5"
            mb="2"
            w="100%"
          >
            <Text color="green.500" fontWeight="extrabold" mb="1">
              Allowance
            </Text>
            <Input
              placeholder="owner address"
              onChange={(e) => setOwner(e.target.value)}
              value={owner}
              focusBorderColor="green.400"
              mb="2"
            />
            <Input
              placeholder="spender address"
              onChange={(e) => setSpender(e.target.value)}
              value={spender}
              focusBorderColor="green.400"
              mb="2"
            />
            {loading ? (
              <Button
                isLoading
                loadingText="Loading"
                mb="8px"
                colorScheme="green"
                size="sm"
              >
                Send
              </Button>
            ) : (
              <Button
                mb="8px"
                colorScheme="green"
                onClick={handleAllowanceClick}
                size="sm"
              >
                Send
              </Button>
            )}
          </Box>
        </Flex>

        <Flex
          direction="column"
          borderWidth="2px"
          p="3"
          borderColor="green.400"
          borderRadius="5"
          mb="2"
        >
          <Text color="green.500" fontWeight="extrabold" mb="2">
            Check Froggies Token Balance
          </Text>
          <Flex borderColor="green.400">
            <Button
              me="2"
              mb="8px"
              colorScheme="green"
              onClick={handleBalanceOfClick}
              size="sm"
            >
              balanceOf
            </Button>
            <Input
              placeholder="Recipient address"
              size="sm"
              onChange={handleAddressChange}
              value={addressBalanceOf}
              focusBorderColor="green.400"
              mb="2"
            />
            <Text color="green.500" fontWeight="extrabold" ms="3">
              {balance >= 0 ? `${balance / DECIMALS} FRG` : ""}
            </Text>
          </Flex>
        </Flex>
        <Flex
          borderWidth="2px"
          p="3"
          borderColor="green.400"
          borderRadius="5"
          mb="2"
          alignItems="center"
        >
          <Button
            mb="8px"
            colorScheme="green"
            value={supply}
            onClick={handleSupplyClick}
            size="sm"
          >
            totalSupply
          </Button>
          <Text color="green.500" fontWeight="extrabold" ms="3">
            {supply > 0 ? `${supply / DECIMALS} FRG` : ""}
          </Text>
        </Flex>
      </Flex>
    </>
  );
};

export default Froggies;
