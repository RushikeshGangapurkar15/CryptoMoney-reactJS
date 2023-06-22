import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../index";
import ErrorComponent from "./ErrorComonent";
import CoinCard from "./CoinCard";
import { Button, Container, HStack, Radio, RadioGroup } from "@chakra-ui/react";
import Loader from "./Loader";

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("inr");

  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  };

  const btns = new Array(100).fill(1);
  const currencySymbol =
    currency === "inr" ? "₹" : currency === "usd" ? "$" : "€";

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(
          `${server}/coins/markets?vs_currency=${currency}&page=${page}`
        );

        setCoins(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchCoin();
  }, [currency, page]);

  if (error) return <ErrorComponent message={"Error While fatching Coins"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <RadioGroup value={currency} onChange={setCurrency}>
            <HStack spacing={"5"} p={"5"}>
              <Button>
                {" "}
                <Radio value={"inr"}> INR</Radio>
              </Button>
              <Button>
                <Radio value={"usd"}> USD</Radio>
              </Button>
              <Button>
                <Radio value={"EUR"}> EUR</Radio>
              </Button>
            </HStack>
          </RadioGroup>
          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {coins.map((i) => (
              <CoinCard
                key={i.id}
                id={i.id}
                name={i.name}
                img={i.image}
                symbol={i.symbol}
                price={i.current_price}
                currencySymbol={currencySymbol}
              />
            ))}
          </HStack>

          <HStack w={"full"} overflow={"auto"} p={"8"}>
            {/* <Button
              bgColor={"blackAlpha.800"}
              color={"white"}
              onClick={() => changePage(2)}
            >
              2
            </Button> */}
            {btns.map((item, index) => (
              <Button
                bgColor={"blackAlpha.800"}
                color={"white"}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Coins;
