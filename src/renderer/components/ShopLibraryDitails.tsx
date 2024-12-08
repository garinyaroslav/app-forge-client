import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { ILibGame } from '../types/game';

interface ShopLibraryDitailsProps {
  gameObj: ILibGame;
}

export const ShopLibraryDitails: FC<ShopLibraryDitailsProps> = ({
  gameObj,
}) => {
  const [imageSrc, setImageSrc] = useState<null | string>(null);

  useEffect(() => {
    const blob = new Blob([gameObj.image], {
      type: 'image/png',
    });
    setImageSrc(URL.createObjectURL(blob));
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [gameObj]);

  return (
    <Flex
      css={{
        padding: '20px',
        gap: '80px',
        justifyContent: 'center',
      }}
    >
      <Flex width={500} direction={'column'} gap={5}>
        <Heading css={{ mb: 5 }}>Об игре</Heading>
        <Text>{gameObj.title}</Text>
      </Flex>
      <Flex
        direction={'column'}
        alignItems={'flex-end'}
        justifyContent={'space-between'}
      >
        <Box>
          <Heading css={{ mb: 5 }}>Изображение игры</Heading>
          {imageSrc ? (
            <Image
              css={{ height: 400, width: 400, borderRadius: 4 }}
              src={imageSrc}
              alt="photo"
            />
          ) : (
            <Skeleton css={{ height: 400, width: 400 }} />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
