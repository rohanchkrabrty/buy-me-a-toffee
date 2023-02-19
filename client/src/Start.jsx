import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useSigner, useAccount } from "wagmi";
import { contractABI, contractAddress } from "./utils/contract";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const Start = () => {
    const { data: signer, isLoading } = useSigner();
    const { address } = useAccount();
    const navigate = useNavigate();
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const addUser = useMutation(async ({ name, description }) => {
        console.log("Start page >> ", name, description);
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        console.log(contract);
        return contract.addUser(name, description).then(txn => txn.wait());
    });

    const onSubmit = values =>
        addUser.mutate(values, {
            onSuccess: () => {
                toast({
                    title: "Page created succesfully",
                    status: "success",
                    duration: 4000,
                });
                navigate(`/profile/${address}`);
            },
        });
    return (
        <Stack align="center">
            <Stack
                mt="8"
                align="center"
                spacing="6"
                as="form"
                minW="xs"
                onSubmit={handleSubmit(onSubmit)}
                noValidate>
                <Text fontSize="2xl" fontWeight="semibold">
                    Start my page
                </Text>
                <FormControl isRequired isInvalid={errors.email}>
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
                        {...register("name", {
                            required: true,
                        })}
                    />
                </FormControl>
                <FormControl isRequired isInvalid={errors.email}>
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
                        {...register("description", {
                            required: true,
                        })}
                    />
                </FormControl>
                <Button
                    type="submit"
                    bgColor="#ffdd00"
                    _hover={{ bgColor: "#ffdd00", opacity: 0.7 }}
                    rounded="full"
                    isLoading={addUser.isLoading || isLoading}>
                    Start my page
                </Button>
            </Stack>
        </Stack>
    );
};

export default Start;
