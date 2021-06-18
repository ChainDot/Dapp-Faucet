import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text } from "@chakra-ui/layout";
import { Flex, Heading } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { useToast } from "@chakra-ui/toast";
import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "web3-hooks";
import { FroggiesContext } from "./App";
import Faucet from "./components/Faucet";
import Froggies from "./components/Froggies";
import { ethers } from "ethers";

const Dapp = () => {
  const MY_ADDRESS = "0xB691FFEfd7f4E2c6D636ab89f6168850113fD4E0";
  const [web3State, login] = useContext(Web3Context);
  const froggies = useContext(FroggiesContext);
  const [frgBalance, setFrgBalance] = useState("");
  const toast = useToast();

  const {
    isOpen: isOpenLogoutModal,
    onOpen: onOpenLogoutModal,
    onClose: onCloseLogoutModal,
  } = useDisclosure();

  const handleLoginClick = () => {
    return !web3State.isLogged ? login() : "";
  };
  // get Froggies Balance
  useEffect(() => {
    if (froggies) {
      const getBalance = async () => {
        try {
          const tx = await froggies.balanceOf(web3State.account);
          setFrgBalance(tx);
        } catch (e) {
          console.error(e);
        }
      };
      getBalance();
    }
  }, [setFrgBalance, froggies, web3State.account]);

  const handleDonateClick = async () => {
    const weiAmount = ethers.utils.parseEther("1");
    try {
      const tx = await web3State.signer.sendTransaction({
        to: MY_ADDRESS,
        value: weiAmount,
      });
      await tx.wait();
      console.log("TX MINED");
      toast({
        title: "Confirmed transaction",
        description: `Address ${web3State.account} donate to ${MY_ADDRESS}\nTransaction hash: ${tx.hash}`,
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
    }
  };
  return (
    <>
      <Flex direction="column" minH="100vh" bg="green.100">
        <Modal isOpen={isOpenLogoutModal} onClose={onCloseLogoutModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Logout using Metamask</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Use MetaMask to logout.</Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="green" onClick={onCloseLogoutModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box p="2rem" bg="green.400">
          <Flex justify="space-around">
            <Heading
              size="lg"
              align="center"
              color="green.900"
              borderWidth="3px"
              borderColor="green.900"
              p="5"
              borderRadius="7"
            >
              Froggies Token & Rinkeby Faucet
            </Heading>

            {!web3State.isLogged ? (
              <Text mb="5px" color="green.900" fontWeight="bold">
                You need to login first.
              </Text>
            ) : (
              <Flex direction="column" mx="24px">
                <Text mb="5px" color="green.900" fontWeight="bold">
                  Account: {web3State.account}
                </Text>
                <Text mb="5px" color="green.900" fontWeight="bold">
                  Ether Balance: {web3State.balance} ETH
                </Text>
                <Text mb="5px" color="green.900" fontWeight="bold">
                  Froggies Balance: {frgBalance / 10 ** 18} FRG
                </Text>
              </Flex>
            )}

            <Button
              colorScheme="green"
              onClick={() =>
                !web3State.isLogged ? handleLoginClick() : onOpenLogoutModal()
              }
            >
              {!web3State.isLogged ? "Log in" : "Log out"}
            </Button>
          </Flex>
        </Box>
        {!web3State.isLogged ? (
          <Alert>
            <AlertIcon />
            Please, login if you want to be able to use the faucet
          </Alert>
        ) : web3State.chainId !== 4 ? (
          <Alert status="error">
            <AlertIcon />
            You are on the wrong network please switch to Rinkeby
          </Alert>
        ) : (
          <Flex bg="green.100">
            <Tabs size="lg" colorScheme="green">
              <TabList>
                <Tab>TOKEN</Tab>
                <Tab>FAUCET</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Froggies />
                </TabPanel>
                <TabPanel>
                  <Faucet />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        )}

        <Flex
          bg="green.400"
          mt="auto"
          p="1.25rem"
          justify="space-around"
          align="center"
        >
          <Text fontSize="lg" fontWeight="bold">
            Dapp made by Chaindot
          </Text>
          <Flex align="center">
            <Text fontSize="md" fontWeight="bold" px="1rem">
              I'm poor support me
            </Text>
            <Button colorScheme="green" onClick={handleDonateClick}>
              Donate
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Dapp;
