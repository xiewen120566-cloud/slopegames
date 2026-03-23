 

export const runtime = "edge";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Card,
  Container,
  SimpleGrid,
  CardBody,
  Flex,
  CardHeader,
  VStack,
  Heading,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
const ElTemplate = dynamic(() => import("@/components/el-temlplate"), { ssr: false })
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getTargetHref, randomGames, splitGames } from "@/utils";
import Info from "@/components/info";
import { getTranslations } from "next-intl/server";
import GameList from "@/components/game-list";
import { FaChevronRight } from "react-icons/fa6";
import { CATEGORY_BG_MAP, CATEGORY_HEADING_COLOR_MAP, CATEGORY_SECONDAY_COLOR_MAP } from "@/configs";
interface Props {
  params: {
    locale: Locale;
  };
  searchParams: Record<string, string>;
}

export default async function Page({
  params: { locale },
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
  const allGames = await getGames(locale);
  const categories = await getCategories(locale);
  const t = await getTranslations({ locale, namespace: "Common" });

  const newGames = randomGames(allGames.length, 18).map((item) => allGames[item]);
  const topGames = randomGames(allGames.length, 18).map((item) => allGames[item]);
  return (
    <>
      <Header hostname={hostname} categories={categories} />
      <Container maxWidth="container.xl" p={0}>
        <ElTemplate 
          id="goplaygame-Home-Banner"
          className="adsbygoogle"
          data-ad-client="ca-pub-3991461507516186"
          data-ad-slot="5753783572"
          data-ad-format="auto"
          data-full-width-responsive="true"
          style={{ display: "block" }}
        />
        <ElTemplate 
          id="goplaygame-Home-MultiAd"
          className="adsbygoogle"
          data-ad-client="ca-pub-3991461507516186"
          data-ad-slot="2282977275"
          data-ad-format="autorelaxed"
          style={{ display: "block" }}
        />
        <VStack alignItems="stretch" gap={5}>
          <Card
            shadow="unset"
            rounded="unset"
            size={{ base: "sm", md: "md", lg: "lg" }}
            bg="rgba(0, 123, 255, .095)"
          >
            <CardHeader>
              <Heading fontSize="lg" textTransform="uppercase" color="rgba(0, 123, 255, .75)">
                {t("Games", { category: t("New") })}
              </Heading>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={{ base: 3, md: 4, lg: 6 }}
              >
                {splitGames(newGames).map((sliceGames, sliceIndex) => {
                  const spans = [0, 3, 1];
                  return (
                    <GameList
                      key={sliceIndex}
                      data={sliceGames}
                      locale={locale}
                      channel={searchParams?.channel}
                      spanIndex={spans[sliceIndex]}
                    />
                  );
                })}
              </SimpleGrid>
            </CardBody>
          </Card>
          <Card
            shadow="unset"
            rounded="unset"
            size={{ base: "sm", md: "md", lg: "lg" }}
            bg="rgba(255, 69, 0, .095)"
          >
            <CardHeader>
              <Heading fontSize="lg" textTransform="uppercase" color="rgb(255, 69, 0, .75)">
                {t("Games", { category: t("Top") })}
              </Heading>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                gap={{ base: 3, md: 4, lg: 6 }}
              >
                {splitGames(topGames).map((sliceGames, sliceIndex) => {
                  const spans = [0, 3, 1];
                  return (
                    <GameList
                      key={sliceIndex}
                      data={sliceGames}
                      locale={locale}
                      channel={searchParams?.channel}
                      spanIndex={spans[sliceIndex]}
                    />
                  );
                })}
              </SimpleGrid>
            </CardBody>
          </Card>
          {categories.map((category, categoryIndex) => {
            const games = allGames.filter(
              (game) => game.categoryId === category.id
            );
            const gamesList = randomGames(games.length, 25).map((item) => games[item]);
            if (!gamesList.length) {
              return null
            }

            return (
              <Card
                key={category.alias}
                shadow="unset"
                rounded="unset"
                bg={CATEGORY_BG_MAP[category.alias]}
                size={{ base: "sm", md: "md", lg: "lg" }}
              >
                <CardHeader>
                  <Flex justifyContent="space-between">
                    <Heading
                      fontSize={{ base: "md", md: "lg" }}
                      color={CATEGORY_HEADING_COLOR_MAP[category.alias]}
                      textTransform="uppercase"
                    >
                      {t("Games", { category:  category.name})}
                    </Heading>
                    <Flex
                      alignItems="center"
                      as="a"
                      href={getTargetHref(
                        locale,
                        `/category/${category.alias}`,
                        searchParams?.channel
                      )}
                      alignSelf="flex-end"
                      color={CATEGORY_SECONDAY_COLOR_MAP[category.alias]}
                      fontWeight="bold"
                      fontSize="xs"
                      opacity={.75}
                    >
                      {t("More")}
                      <FaChevronRight size="10px" />
                    </Flex>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <SimpleGrid
                    columns={{ base: 1, md: 3 }}
                    gap={{ base: 3, md: 4, lg: 6 }}
                  >
                    {splitGames(gamesList.slice(0, 18)).map((sliceGames, sliceIndex) => {
                      let spans = [0, 1, 3];
                      if (categoryIndex % 2) {
                        spans = [1, 3, 4];
                      }
                      return (
                        <GameList
                          key={sliceIndex}
                          data={sliceGames}
                          locale={locale}
                          channel={searchParams?.channel}
                          spanIndex={spans[sliceIndex]}
                        />
                      );
                    })}
                  </SimpleGrid>
                </CardBody>
              </Card>
            );
          })}
          <Info locale={locale} />
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
