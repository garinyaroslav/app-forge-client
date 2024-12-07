import { FC, useEffect, useRef, useState } from 'react';
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
import { toaster, Toaster } from './ui/toaster';

interface GameCardProps {
  gameObj: IGame & { gameGenres: { genreName: string } };
}

export const GameCard: FC<GameCardProps> = ({ gameObj }) => {
  const nav = useNavigate();
  const imageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [gameInCart, setGameInCart] = useState(false);
  const [gameInLib, setGameInLib] = useState(false);

  const makeImg = async () => {
    const blob = await new Blob([gameObj.image], {
      type: 'image/png',
    });
    await setImageSrc(URL.createObjectURL(blob));
  };

  const makeChecks = async () => {
    const uid = await Number(localStorage.getItem('uid'));

    const hasGameInCart = await window.api
      .getGameFromUserCart(uid, gameObj.id)
      .catch(console.error);

    if (hasGameInCart.length > 0) {
      setGameInCart(true);
      return;
    }

    const hasGameInLib = await window.api
      .getGameFromUserLib(uid, gameObj.id)
      .catch(console.error);

    if (hasGameInLib.length > 0) {
      setGameInLib(true);
    }
  };

  const addToCart = async () => {
    const uid = await Number(localStorage.getItem('uid'));

    const addRes = await window.api.addGameInUserCart(uid, gameObj.id);
    if (addRes) {
      await makeChecks();
      toaster.create({
        description: `Игра: ${gameObj.title} добавлена в корзину`,
        type: 'success',
      });
    }
  };

  useEffect(() => {
    setGameInLib(false);
    setGameInCart(false);
    makeImg();
    makeChecks();

    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [gameObj]);

  return (
    <>
      <Toaster />
      <CardRoot flexDirection="row" mb={6}>
        {imageSrc ? (
          <Image
            ref={imageRef}
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
            {gameInCart && (
              <Button disabled size={'xs'}>
                Игра уже в корзине
              </Button>
            )}
            {gameInLib && (
              <Button disabled size={'xs'}>
                Игра уже куплена
              </Button>
            )}
            {!gameInCart && !gameInLib && (
              <Button onClick={() => addToCart()} size={'xs'}>
                Добавить в корзину
              </Button>
            )}
          </CardFooter>
        </Box>
      </CardRoot>
    </>
  );
};
