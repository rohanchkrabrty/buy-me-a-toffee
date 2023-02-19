import React, { useEffect } from "react";
import { Button, HStack, Icon, Modal } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import Jazzicon from "react-jazzicon";
import { contractABI, contractAddress } from "./utils/contract";
import { useAccount, useContractRead } from "wagmi";

const CustomConnectButton = ({ size = "md", showConnectButton = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { address, isDisconnected } = useAccount();
    const contractRead = useContractRead({
        address: contractAddress,
        abi: contractABI,
        functionName: "isValidUser",
        args: [address],
        enabled: !isDisconnected,
        watch: true,
    });

    useEffect(() => {
        if (location.pathname.includes("start") && contractRead?.data)
            navigate(`/profile/${address}`);
    }, [location.pathname, contractRead.data]);

    console.log("Contract data >> ", contractRead.isLoading, contractRead.data);
    return (
        <ConnectKitButton.Custom>
            {({
                isConnected,
                isConnecting,
                show,
                hide,
                truncatedAddress,
                address,
            }) => {
                if (!isConnected)
                    return (
                        <Button
                            bgColor="#ffdd00"
                            _hover={{ bgColor: "#ffdd00", opacity: 0.7 }}
                            rounded="full"
                            onClick={
                                !isConnected ? show : () => navigate("/start")
                            }
                            isLoading={isConnecting}
                            size={size}>
                            Connect wallet
                        </Button>
                    );
                return (
                    <HStack spacing="4">
                        {isConnected && showConnectButton && (
                            <Button
                                rounded="full"
                                onClick={show}
                                isLoading={isConnecting}
                                px="3"
                                size={size}
                                leftIcon={
                                    <Jazzicon diameter={24} seed={address} />
                                }
                                rightIcon={
                                    <Icon w="4" h="4" as={FiChevronDown} />
                                }>
                                {truncatedAddress}
                            </Button>
                        )}
                        <Button
                            bgColor="#ffdd00"
                            _hover={{ bgColor: "#ffdd00", opacity: 0.7 }}
                            rounded="full"
                            onClick={() =>
                                contractRead?.data
                                    ? navigate(`/profile/${address}`)
                                    : navigate("/start")
                            }
                            isLoading={contractRead.isLoading}
                            size={size}>
                            {contractRead?.data
                                ? "Go to profile"
                                : "Start my page"}
                        </Button>
                    </HStack>
                );
            }}
        </ConnectKitButton.Custom>
    );
};

export default CustomConnectButton;
