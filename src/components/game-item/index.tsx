import { Locale } from "@/i18n/routing";
import { GameRecord } from "@/services/data";
import { getTargetHref } from "@/utils";
import { AspectRatio, Heading, LinkBox, LinkOverlay } from "@chakra-ui/react";
import Image from "next/image";

const GameItem = ({
  data,
  locale,
  channel,
}: {
  data: GameRecord;
  locale: Locale;
  channel?: string;
}) => {
  if(!data){
    return null;
  }
  return (
    <LinkBox
      rounded={{ base: "md", md: "lg", lg: "xl" }}
      overflow="hidden"
      position="relative"
    >
      <AspectRatio ratio={1}>
        <Image alt={data?.name} width={200} height={200} src={data?.image} priority={false} />
      </AspectRatio>
      <LinkOverlay
        href={getTargetHref(locale, `/detail/${data.id}`, channel)}
      >
        <Heading
          width="full"
          noOfLines={1}
          px={2}
          py={1}
          as="h5"
          lineHeight={1.5}
          size="xs"
          fontSize="xs"
          position="absolute"
          left={0}
          bottom={0}
          zIndex={2}
          background="blackAlpha.700"
          color="white"
        >
          {data.name}
        </Heading>
      </LinkOverlay>
    </LinkBox>
  );
};

export default GameItem