import { FC, useEffect, useState } from 'react';
import {
  CardRoot,
  Image,
  Box,
  CardBody,
  CardTitle,
  CardDescription,
  HStack,
  Badge,
  CardFooter,
  Button,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IGame } from '../types/game';

interface GameCardProps {
  gameObj: IGame & { gameGenres: { genreName: string } };
}

export const GameCard: FC<GameCardProps> = ({ gameObj }) => {
  const nav = useNavigate();
  const [imageSrc, setImageSrc] = useState<null | string>(null);

  useEffect(() => {
    const blob = new Blob([gameObj.image], {
      type: 'image/png',
    });
    setImageSrc(URL.createObjectURL(blob));

    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, []);

  return (
    <CardRoot flexDirection="row" mb={6}>
      {imageSrc ? (
        <Image
          objectFit="cover"
          maxW="350px"
          minW="350px"
          src={imageSrc ?? 'unset'}
          alt="Caffe Latte"
          css={{
            borderRadius: 4,
          }}
        />
      ) : (
        <Skeleton width={'350px'} height={'350px'} />
      )}
      <Box w={'100%'}>
        <CardBody w={'100%'}>
          <Flex
            css={{
              mb: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <CardTitle css={{ fontSize: 20, fontWeight: 600 }}>
              {gameObj.title}
            </CardTitle>
            <CardTitle css={{ fontSize: 20, fontWeight: 500 }}>
              {gameObj.price} руб.
            </CardTitle>
          </Flex>
          <CardDescription>{`${gameObj.description} Купили: ${gameObj.copiesSold} раз`}</CardDescription>
          <HStack my="4">
            <Badge css={{ background: '#808080' }}>
              {gameObj.gameGenres.genreName}
            </Badge>
          </HStack>
        </CardBody>
        <CardFooter>
          <Button onClick={() => nav(`./${gameObj.id}`)} size={'xs'}>
            Подробнее
          </Button>
          <Button onClick={() => { }} size={'xs'}>
            Добавить в корзину
          </Button>
        </CardFooter>
      </Box>
    </CardRoot>
  );
};
