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
import { base64ToBlob } from '@/utils/base64ToBlob';

interface ProductCardProps {
  productObj: IProduct & { genre_name: string };
}

export const ProductCard: FC<ProductCardProps> = ({ productObj }) => {
  const nav = useNavigate();
  const imageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [productInCart, setProductInCart] = useState(false);
  const [productInLib, setProductInLib] = useState(false);

  const makeImg = async () => {
    const blob = await base64ToBlob(productObj.image, 'image/png');

    await setImageSrc(URL.createObjectURL(blob));
  };

  const makeChecks = async () => {
    try {
      const res = await a.get<IProduct[]>('/software/user/cart/', {
        params: { product_id: productObj.id },
      });
      let resData = res.data;

      if (resData.length > 0) {
        setProductInCart(true);
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await a.get<IProduct[]>(`/software/library_item/`, {
        params: { product_id: productObj.id },
      });
      let resData = res.data;

      if (resData.length > 0) {
        setProductInLib(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = async () => {
    const res = await a.post<IProduct[]>('/software/user/cart/', {
      product_id: Number(productObj.id),
    });

    if (res.status === 201) {
      toaster.create({
        description: `Продукт: ${productObj.title} добавлен в корзину`,
        type: 'success',
      });
    }
    makeChecks();
  };

  useEffect(() => {
    setProductInLib(false);
    setProductInCart(false);
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
            {productInCart && (
              <Button disabled size={'xs'}>
                Продукт уже в корзине
              </Button>
            )}
            {productInLib && (
              <Button disabled size={'xs'}>
                Продукт уже куплен
              </Button>
            )}
            {!productInCart && !productInLib && (
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
