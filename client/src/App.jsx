import React, { lazy, Suspense, useMemo, useEffect } from "react";
import { Center, Spinner, Stack } from "@chakra-ui/react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Container from "./Container";
import Home from "./Home";
import Start from "./Start";
import { useAccount } from "wagmi";
import Profile from "./Profile";

const App = () => {
    const { isDisconnected } = useAccount();
    return (
        <Routes>
            <Route element={<Container />}>
                <Route path="/" element={<Home />} />
                {!isDisconnected && (
                    <>
                        <Route path="/start" element={<Start />} />
                    </>
                )}
                <Route path="/profile/:profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
