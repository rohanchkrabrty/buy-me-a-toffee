import React from "react";
import { Button, Stack, Text } from "@chakra-ui/react";
import Logo from "./Logo";
import CustomConnectButton from "./CustomConnectButton";

const Home = () => {
    return (
        <Stack w="full" h="full" justify="center" align="center">
            <Stack minH="lg" align="center" spacing="6">
                <Stack rounded="full" p="6" bg="gray.900" border="1px solid">
                    <Logo w="20" h="20" />
                </Stack>
                <Stack align="center" spacing="10">
                    <Stack align="center" spacing="4">
                        <Text
                            fontWeight="medium"
                            maxW="2xl"
                            fontSize="6xl"
                            lineHeight="shorter"
                            textAlign="center">
                            Great futures are built with a small help
                        </Text>
                        <Text fontSize="lg" color="gray.700">
                            It’s easier than you think.
                        </Text>
                    </Stack>
                    <CustomConnectButton size="lg" showConnectButton={false} />
                </Stack>
            </Stack>
        </Stack>
    );
};

export default Home;
