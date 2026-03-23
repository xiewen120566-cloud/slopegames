 

export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaCirclePlay } from "react-icons/fa6";
import { getCategories, getGames } from "@/actions";
import Footer from "@/components/footer";
import GameItem from "@/components/game-item";
import Header from "@/components/header";
import Info from "@/components/info";
import StarRating from "@/components/star-rating";
import { Locale } from "@/i18n/routing";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { CATEGORY_BG_MAP } from "@/configs";
import { getTargetHref, randomGames} from "@/utils";
const ElTemplate = dynamic(() => import("@/components/el-temlplate"), { ssr: false })
interface Props {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams: Record<string, string>;
}
const getLikes = () => {
  const min = 3;
  const max = 5;
  const number = Math.random() * (max - min) + min;
  return parseFloat(number.toFixed(1)); // 保留一位小数
};
export default async function Page({
  params: { locale, slug },
  searchParams,
}: Props) {
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://slopegames.net";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  const { hostname } = new URL(normalizedBaseUrl);
  const categories = await getCategories(locale);
  const allGames = await getGames(locale);
  const t = await getTranslations({ locale, namespace: "Common" });
  const game = allGames.find((item) => item.id.toString() === slug);
  if (!game) {
    return notFound();
  }

  const category = categories.find((item) => item.id === game.categoryId);

  const categoryByGames = allGames.filter(
    (item) => item.categoryId === category?.id && item.slug !== slug
  );
  const typeGames = randomGames(categoryByGames.length, 18).map((item) => categoryByGames[item]);

  if (!category) {
    return null;
  }
  return (
    <>
      <style>
        {`
      body {
        background: ${CATEGORY_BG_MAP[category.alias]}
      } 
`}
      </style>
      <Header hostname={hostname} categories={categories} />
      <AspectRatio
        ratio={{ base: 16 / 9, md: 3 / 1 }}
        objectFit="contain"
        rounded="none"
        overflow="hidden"
      >
        <Image
          alt={game.name}
          width={200}
          height={200}
          src={game.image}
          priority={false}
        />
      </AspectRatio>
      <Container maxWidth="container.xl" p={0}>
        <ElTemplate 
          id="goplaygame-Detail-Banner"
          className="adsbygoogle"
          data-ad-client="ca-pub-3991461507516186"
          data-ad-slot="2203654449"
          data-ad-format="auto"
          data-full-width-responsive="true"
          style={{ display: "block" }}
        />
        <ElTemplate 
          id="goplaygame-Detail-MultiAd"
          className="adsbygoogle"
          data-ad-client="ca-pub-3991461507516186"
          data-ad-slot="2282977275"
          data-ad-format="autorelaxed"
          style={{ display: "block" }}
        />
      </Container>
      <Box mb={8}>
        <Container maxWidth="container.xl" p={0}>
          <Card
            shadow="unset"
            rounded="unset"
            size={{ base: "sm", md: "md", lg: "lg" }}
            bg="transparent"
          >
            <CardBody pt={0}>
              <Flex gap={3} alignItems="flex-start">
                <Box flex={1} position="relative" maxW="128px">
                  <AspectRatio
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    ratio={1}
                    objectFit="contain"
                    rounded="full"
                    border="4px solid"
                    color="white"
                    borderColor="#f7faff"
                    overflow="hidden"
                    marginTop="-50%"
                  >
                    <Image
                      alt={game.name}
                      width={200}
                      height={200}
                      src={game.image}
                      priority={false}
                    />
                  </AspectRatio>
                </Box>

                <Box flex={2}>
                  <Heading lineHeight={1.5} size="lg" p={2} pl={0} as="h2">
                    {game.name}
                  </Heading>
                  <StarRating
                      size="12px"
                      rating={getLikes()}
                      color="#ffaa25"
                    />
                  <Flex gap={2} py={2} alignItems="center">
                    <Box fontSize="2xs">BY</Box>
                    <Tag
                      fontSize="2xs"
                      size="sm"
                      rounded="sm"
                      colorScheme="cyan"
                    >
                      {category?.name}
                    </Tag>
                  </Flex>
                </Box>
              </Flex>
              <Flex justifyContent="center" py={3}>
                <Button
                  colorScheme="cyan"
                  size="lg"
                  width="260px"
                  rounded="full"
                  as="a"
                  rel="noopener noreferrer"
                  href={getTargetHref(
                    locale,
                    `/play/${slug}`,
                    searchParams?.channel
                  )}
                  rightIcon={<FaCirclePlay />}
                >
                  {t("Play")}
                </Button>
              </Flex>
              <Heading as="h3" size="md" py={3}>
                {t("Introduction")}
              </Heading>
              <Text>{game.description}</Text>
            </CardBody>
          </Card>
        </Container>
      </Box>
      <Container maxWidth="container.xl" p={0}>
        <Card
          shadow="unset"
          rounded="unset"
          size={{ base: "sm", md: "md", lg: "lg" }}
          bg="transparent"
        >
          <CardBody pt={0}>
            <SimpleGrid
              gap={3}
              columns={{ base: 3, sm: 4, md: 6, lg: 8, xl: 12 }}
            >
              {typeGames.map((item) => {
                return (
                  <GameItem
                    key={item?.id}
                    data={item}
                    locale={locale}
                    channel={searchParams?.channel}
                  />
                );
              })}
            </SimpleGrid>
          </CardBody>
        </Card>
        <Info locale={locale} />
      </Container>
      <Footer />
    </>
  );
}
