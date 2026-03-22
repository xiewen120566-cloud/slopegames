"use client";
import { PropsWithChildren } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import LocaleSwitcher from "./locale-switcher";
import SideNav from "./side-nav";
import { getTargetHref } from "@/utils";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { CategoryRecord } from "@/services/data";
export const DesktopNavlink = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => {
  return (
    <Button as="a" size="md" variant="ghost" href={href}>
      {children}
    </Button>
  );
};
export default function Header({
  hostname,
  categories,
}: {
  hostname: string;
  categories: CategoryRecord[];
}) {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  return (
    <Flex
      alignItems="center"
      gap={12}
      height="16"
      position="sticky"
      px={{ base: 3, md: 4, lg: 6 }}
      py={3}
      top={0}
      w="full"
      zIndex="sticky"
      bg="rgb(66, 145, 245)"
    >
      <Box
        as="a"
        href={getTargetHref(locale, "/", searchParams.get("channel"))}
      >
        <Heading as="h1" size="lg" color="#333">
          {hostname.toUpperCase()}
        </Heading>
      </Box>
      <Flex flex={1} hideBelow="lg" justifyContent="space-between" gap={12}>
        <Flex justifyContent="flex-end">
          {categories.map((category) => (
            <DesktopNavlink
              href={getTargetHref(locale, `/category/${category.alias}`)}
              key={category.id}
            >
              {category.name}
            </DesktopNavlink>
          ))}
        </Flex>
        <Flex gap={1}>
          <LocaleSwitcher />
        </Flex>
      </Flex>
      <Flex hideFrom="lg" justifyContent="flex-end" flex={1}>
        <SideNav categories={categories} />
      </Flex>
    </Flex>
  );
}