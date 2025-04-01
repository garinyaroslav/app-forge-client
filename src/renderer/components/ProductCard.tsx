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
import { toaster, Toaster } from './ui/toaster';
import { IProduct } from '../types/product';
import a from '../axios';

interface ProductCardProps {
  productObj: IProduct & { genre_name: string };
}

export const ProductCard: FC<ProductCardProps> = ({ productObj }) => {
  const nav = useNavigate();
  const imageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [gameInCart, setGameInCart] = useState(false);
  const [gameInLib, setGameInLib] = useState(false);

  const makeImg = async () => {
    const blob = await new Blob([productObj.image], {
      type: 'image/png',
    });
    await setImageSrc(URL.createObjectURL(blob));
  };

  const makeChecks = async () => {
    const uid = await localStorage.getItem('uid');

    try {
      const res = await a.get<IProduct[]>(
        `/software/user/cart/?product_id=${productObj.id}`,
      );
      let resData = res.data;

      if (resData.length > 0) {
        setGameInCart(true);
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await a.get<IProduct[]>(
        `/software/library_item/?product_id=${productObj.id}`,
      );
      let resData = res.data;

      if (resData.length > 0) {
        setGameInCart(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = async () => {
    const uid = await Number(localStorage.getItem('uid'));

    const addRes = await window.api.addGameInUserCart(uid, productObj.id);
    if (addRes) {
      await makeChecks();
      toaster.create({
        description: `Игра: ${productObj.title} добавлена в корзину`,
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
  }, [productObj]);

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
                {productObj.title}
              </CardTitle>
              <CardTitle css={{ fontSize: 20, fontWeight: 500 }}>
                {productObj.price} руб.
              </CardTitle>
            </Flex>
            <CardDescription>{`${productObj.description} Купили: ${productObj.copies_sold} раз`}</CardDescription>
            <HStack my="4">
              <Badge css={{ background: '#808080' }}>
                {productObj.genre_name}
              </Badge>
            </HStack>
          </CardBody>
          <CardFooter>
            <Button onClick={() => nav(`./${productObj.id}`)} size={'xs'}>
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
