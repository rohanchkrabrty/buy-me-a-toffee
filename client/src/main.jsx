import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import "@fontsource/figtree";
import App from "./App";
import { mantleTestnet } from "./utils/mantle";
import Jazzicon from "react-jazzicon";
import "focus-visible/dist/focus-visible";

const rootElement = document.getElementById("root");

const queryClient = new QueryClient();

const chains = [mantleTestnet];
const client = createClient(
    getDefaultClient({
        appName: "BuyMeAToffee",
        autoConnect: true,
        chains,
    })
);

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: "#fffce6",
                fontFamily: '"Figtree", sans-serif',
                fontFeatureSettings: '"calt" off',
            },
            ".js-focus-visible :focus:not([data-focus-visible-added])": {
                outline: "none",
                boxShadow: "none",
            },
        },
    },
});
createRoot(rootElement).render(
    <React.StrictMode>
        <ChakraProvider resetCSS theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <WagmiConfig client={client}>
                        <ConnectKitProvider
                            theme="soft"
                            customTheme={{
                                "--ck-overlay-background":
                                    "var(--chakra-colors-blackAlpha-700)",
                                "--ck-overlay-backdrop-filter": "blur(10px)",
                            }}
                            options={{
                                customAvatar: ({ address, size }) => (
                                    <Jazzicon diameter={size} seed={address} />
                                ),
                            }}>
                            <App />
                        </ConnectKitProvider>
                    </WagmiConfig>
                </BrowserRouter>
            </QueryClientProvider>
        </ChakraProvider>
    </React.StrictMode>
);
