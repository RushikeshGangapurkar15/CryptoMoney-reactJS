import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import btcSrc from "../Assets/btc.png";

const Home = () => {
  return (
    <Box bgColor={""} w={"full"} h={"80vh"}>
      <Text
        fontSize={"6xl"}
        textAlign={"center"}
        fontWeight={"thin"}
        color={"blackAlpha.1000"}
      >
        CryptoMoney
      </Text>
      <Image w={"full"} h={"full"} objectFit={"contain"} src={btcSrc}></Image>
    </Box>
  );
};

export default Home;
