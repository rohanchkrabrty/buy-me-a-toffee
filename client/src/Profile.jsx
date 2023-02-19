import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { contractABI, contractAddress } from "./utils/contract";
import { useAccount, useSigner, useContractRead } from "wagmi";
import {
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Text,
    Textarea,
    VStack,
    useToast,
    Stack,
} from "@chakra-ui/react";
import Jazzicon from "react-jazzicon";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import CustomConnectButton from "./CustomConnectButton";

const Profile = () => {
    const { data: signer, isLoading } = useSigner();
    const navigate = useNavigate();
    const { profile } = useParams();
    const toast = useToast();
    const { address, isDisconnected } = useAccount();
    const contractRead = useContractRead({
        address: contractAddress,
        abi: contractABI,
        functionName: "getUser",
        args: [profile],
        enabled: !!profile,
        watch: true,
    });
    const memoRead = useContractRead({
        address: contractAddress,
        abi: contractABI,
        functionName: "getMemos",
        args: [profile],
        enabled: !!profile,
        watch: true,
    });
    const isMyProfile = profile === address;
    console.log("Mmeo data >> ", memoRead?.data);
    useEffect(() => {
        // redirect to home on bad url
        if (!contractRead?.data?.profileAddress) navigate(`/`);
    }, [contractRead.data]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const buyToffee = useMutation(async ({ name, description }) => {
        console.log("buy toffee >> ", name, description);
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        console.log(contract);
        return contract
            .buyToffee(profile, name, description, false, {
                value: ethers.utils.parseEther("1"),
            })
            .then(txn => txn.wait());
    });
    const withdraw = useMutation(async () => {
        console.log("withdraw >> ");
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        return await contract.withdraw(address).then(txn => txn.wait());
    });

    return (
        <VStack
            mt="8"
            w="full"
            spacing="6"
            divider={<Divider borderColor="gray.300" />}>
            <VStack spacing="4">
                <Jazzicon
                    diameter={60}
                    seed={contractRead?.data?.profileAddress}
                />
                <VStack spacing="0.5">
                    <Text fontSize="2xl" fontWeight="semibold">
                        {contractRead?.data?.name}
                    </Text>
                    <Text color="gray.600">
                        {contractRead?.data?.description}
                    </Text>
                </VStack>
            </VStack>
            <HStack w="full" justify="center" spacing="14" align="flex-start">
                <VStack minW="sm" spacing="6">
                    {memoRead?.isLoading && <Text>Fetching tips</Text>}
                    {!memoRead?.isLoading && !(memoRead?.data ?? []).length && (
                        <Text color="gray.500" fontSize="sm" mt="20">
                            No toffess received yet
                        </Text>
                    )}
                    {!memoRead?.isLoading &&
                        (memoRead?.data ?? []).map(memo => (
                            <Stack
                                bg="white"
                                p="4"
                                px="6"
                                rounded="lg"
                                w="full"
                                border="1px solid"
                                borderColor="gray.200">
                                <HStack>
                                    <Jazzicon diameter={16} seed={memo?.from} />
                                    <Text fontWeight="medium">
                                        {memo?.name} bought you a toffee!
                                    </Text>
                                </HStack>
                                <Text fontSize="sm">{memo?.message}</Text>
                            </Stack>
                        ))}
                </VStack>
                {isMyProfile ? (
                    <VStack
                        bg="white"
                        border="1px solid"
                        borderColor="#ffdd00"
                        p="8"
                        px="10"
                        rounded="lg"
                        spacing="6">
                        <VStack spacing="1">
                            <Text fontSize="lg" fontWeight="semibold">
                                My earnings
                            </Text>
                            <Text fontSize="lg">
                                {ethers.utils.formatEther(
                                    contractRead?.data?.balance
                                )}{" "}
                                BIT
                            </Text>
                        </VStack>
                        <Button
                            minW="200px"
                            bgColor="#ffdd00"
                            _hover={{ bgColor: "#ffdd00", opacity: 0.7 }}
                            rounded="full"
                            onClick={() =>
                                withdraw.mutate(null, {
                                    onSuccess: () => {
                                        toast({
                                            title: "Withdrawal success",
                                            status: "success",
                                            duration: 4000,
                                        });
                                    },
                                })
                            }
                            isLoading={
                                contractRead.isLoading || withdraw.isLoading
                            }>
                            Withdraw
                        </Button>
                    </VStack>
                ) : (
                    <VStack
                        bg="white"
                        border="1px solid"
                        borderColor="#ffdd00"
                        p="8"
                        px="10"
                        rounded="lg"
                        spacing="6"
                        as="form"
                        onSubmit={handleSubmit(
                            values => buyToffee.mutate(values),
                            {
                                onSuccess: () => {
                                    toast({
                                        title: "Bought toffee succesfully",
                                        status: "success",
                                        duration: 4000,
                                    });
                                },
                            }
                        )}
                        noValidate>
                        <VStack spacing="5">
                            <Text fontSize="lg" fontWeight="semibold">
                                Buy {contractRead?.data?.name} a toffee
                            </Text>
                            <FormControl isInvalid={errors.email}>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    _focus={{
                                        border: "1px solid black",
                                        outline: "none",
                                        boxShadow: "none",
                                    }}
                                    border="1px solid"
                                    borderColor="gray.300"
                                    rounded="lg"
                                    bg="white"
                                    type="text"
                                    {...register("name")}
                                />
                            </FormControl>
                            <FormControl isInvalid={errors.email}>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    bg="white"
                                    colorScheme="yellow"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    rounded="lg"
                                    _focus={{
                                        border: "1px solid black",
                                        outline: "none",
                                        boxShadow: "none",
                                    }}
                                    {...register("description")}
                                />
                            </FormControl>
                            <Checkbox colorScheme="gray">
                                Remain anonymous?
                            </Checkbox>
                        </VStack>
                        {isDisconnected ? (
                            <CustomConnectButton />
                        ) : (
                            <Button
                                type="submit"
                                minW="200px"
                                bgColor="#ffdd00"
                                _hover={{ bgColor: "#ffdd00", opacity: 0.7 }}
                                rounded="full"
                                isLoading={buyToffee.isLoading || isLoading}>
                                Support 1 BIT
                            </Button>
                        )}
                    </VStack>
                )}
            </HStack>
        </VStack>
    );
};

export default Profile;
