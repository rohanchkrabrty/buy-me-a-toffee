import React from "react";
import { Flex, useBreakpointValue, Box, HStack, Text } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import Logo from "./Logo";
import CustomConnectButton from "./CustomConnectButton";
import { useNavigate } from "react-router-dom";

const Container = () => {
    const { address, isConnecting, isDisconnected } = useAccount();
    const navigate = useNavigate();
    console.log("Address >> ", address);
    return (
        <Flex
            as="section"
            direction="column"
            height="100vh"
            bg="bg-canvas"
            overflowY="auto"
            w="full"
            align="center"
            gap="8">
            <HStack
                w="full"
                bg="white"
                maxW="4xl"
                rounded="full"
                justify="space-between"
                boxShadow="rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 2.65546px 95px 0px"
                mt="8"
                p="4"
                px="7">
                <HStack
                    spacing="3"
                    onClick={() => navigate("/")}
                    cursor="pointer">
                    <Logo />
                    <Text fontWeight="semibold" fontSize="lg">
                        Buy me a Toffee
                    </Text>
                </HStack>
                <CustomConnectButton />
            </HStack>
            <Box flex="1" maxW="4xl" w="full" pb="20">
                <Outlet />
            </Box>
        </Flex>
    );
};
export default Container;
