import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import Loader from "./Loader";
import { useParams } from "react-router-dom";
import Chart from "./Chart";
import { server } from "../index";
import axios from "axios";
import ErrorComponent from "./ErrorComonent";

const CoinDetails = () => {
  const [coins, setCoin] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currency, setCurrency] = useState("inr");
  const params = useParams();

  const [days, setDays] = useState("24Hr");
  const [chartArray, setChartArray] = useState([]);

  const currencySymbol =
    currency === "inr" ? "₹" : currency === "usd" ? "$" : "€";

  const btns = ["24h", "7d", "14d", "30d", "60d", "365d", "max"];
  const switchChart = (key) => {
    switch (key) {
      case "7d":
        setDays("7d");
        setLoading(true);
        break;
      case "14d":
        setDays("14d");
        setLoading(true);
        break;
      case "30d":
        setDays("30d");
        setLoading(true);
        break;
      case "60d":
        setDays("60d");
        setLoading(true);
        break;
      case "365d":
        setDays("365d");
        setLoading(true);
        break;
      case "max":
        setDays("max");
        setLoading(true);
        break;

      default:
        setDays("24h");
        setLoading(true);

        break;
    }
  };

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/${params.id}`);
        const { data: chartData } = await axios.get(
          `${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`
        );

        setChartArray(chartData.prices);
        setCoin(data);

        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchCoin();
  }, [params.id, currency, days]);

  if (error) return <ErrorComponent message={"Error While fatching Coin"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box width={"full"} borderWidth={1} p={"5"} marginTop={"3"}>
            <Chart arr={chartArray} currency={currencySymbol} days={days} />
          </Box>

          <HStack p={"4"} wrap={"wrap"}>
            {btns.map((i) => (
              <Button key={i} onClick={() => switchChart(i)}>
                {i}
              </Button>
            ))}
          </HStack>

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

          <VStack spacing={"4"} p={"16"} alignItems={"flex-start"}>
            <Text fontSize={"small"} alignSelf={"Center"} opacity={"0.7"}>
              Last update on{" "}
              {Date(coins.market_data.last_updated).split("G")[0]}
            </Text>

            <Image
              src={coins.image.large}
              w={"16"}
              h={"16"}
              objectFit={"contain"}
            />

            <Stat>
              <StatLabel>{coins.name}</StatLabel>
              <StatNumber>
                {currencySymbol}
                {coins.market_data.current_price[currency]}
              </StatNumber>

              <StatHelpText>
                <StatArrow
                  type={
                    coins.market_data.price_change_percentage_24h < 0
                      ? "decrease"
                      : "increase"
                  }
                />
                {coins.market_data.price_change_percentage_24h}%
              </StatHelpText>
            </Stat>

            <Badge
              fontSize={"2xl"}
              bgColor={"blackAlpha.800"}
              color={"white"}
            >{`#${coins.market_cap_rank}`}</Badge>

            <CustomBar
              high={`${currencySymbol}${coins.market_data.high_24h[currency]}`}
              low={`${currencySymbol}${coins.market_data.low_24h[currency]}`}
            />

            <Box w={"full"} p={4}>
              <Item title={"Max supply"} value={coins.market_data.max_supply} />
              <Item
                title={"Circulating supply"}
                value={coins.market_data.circulating_supply}
              />
              <Item
                title={"Market Cpaital"}
                value={`${currencySymbol}${coins.market_data.market_cap[currency]}`}
              />
            </Box>
          </VStack>
        </>
      )}
    </Container>
  );
};

const Item = ({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"}>
    <Text letterSpacing={"wider"}> {title}</Text>

    <Text>{value}</Text>
  </HStack>
);

const CustomBar = ({ high, low }) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24Hr Range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
);

export default CoinDetails;
