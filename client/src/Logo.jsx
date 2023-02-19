import React from "react";
import { Image } from "@chakra-ui/react";
import toffee from "./assets/toffee.png";

const Logo = ({ w = "8", h = "8", ...props }) => {
    return <Image src={toffee} w={w} h={h} {...props} />;
};

export default Logo;
