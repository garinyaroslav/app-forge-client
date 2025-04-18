import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  Badge,
  Skeleton,
  Heading,
  Separator,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowSvg from '../assets/arrowLeftBlack.svg';
import { Rating } from './ui/rating';
import { Blockquote } from './ui/blockquote';
import { DataListItem, DataListRoot } from './ui/data-list';
import { Button } from './ui/button';
import { Toaster, toaster } from './ui/toaster';
import { IReviewObj } from '../types/review';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { IProduct } from '../types/product';
import { ProductShopReview } from './ProductShopReview';
import { unixToUSATime } from '@/utils/unixToUSADate';
import a from '../axios';
import { base64ToBlob } from '@/utils/base64ToBlob';

export const ProductShopDitails = () => {
  const nav = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState<
    null | (IProduct & { genre_name: string })
  >(null);
  const [reviews, setReviews] = useState<null | IReviewObj[]>(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [productInCart, setProductInCart] = useState(false);
  const [productInLib, setProductInLib] = useState(false);

  const getProductAndWriteToState = async () => {
    const res = await a.get<IProduct & { genre_name: string }>(
      '/software/list/',
      { params: { id: productId } },
    );
    const resData = res.data;
    setProduct(resData);

    const blob = base64ToBlob(resData.image, 'image/png');
    setImageSrc(URL.createObjectURL(blob));
  };

  const getReviewsAndWriteToState = async () => {
    const res = await a.get<IReviewObj[]>('/software/reviews/', {
      params: { product_id: productId },
    });
    const resData = res.data;

    if (resData.length === 0) setReviews(null);
    else setReviews(resData);
  };

  const makeChecks = async () => {
    try {
      const res = await a.get<IProduct[]>('/software/user/cart/', {
        params: { product_id: productId },
      });
      let resData = res.data;

      if (resData.length > 0) {
        setProductInCart(true);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const res = await a.get<IProduct[]>(`/software/library_item/`, {
        params: { product_id: productId },
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
      product_id: Number(productId),
    });

    if (res.status === 201) {
      toaster.create({
        description: 'Продукт добавлена в корзину',
        type: 'success',
      });
    }
    makeChecks();
  };

  useEffect(() => {
    setProductInLib(false);
    setProductInCart(false);
    makeChecks();
    getProductAndWriteToState();
    getReviewsAndWriteToState();
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, []);

  const renderReviews = (reviewsObj: IReviewObj[]) => {
    return reviewsObj.map((reviewObj) => (
      <ProductShopReview key={reviewObj.id} review={reviewObj} />
    ));
  };

  if (product)
    return (
      <Flex
        flexDirection={'column'}
        alignItems={'center'}
        css={{ height: '850px', ...scrollBarStyles }}
      >
        <Toaster />
        <Flex
          onClick={() => nav('/user/shop')}
          css={{
            gap: 3,
            alignItems: 'center',
            cursor: 'pointer',
            width: 1000,
            mt: 5,
          }}
        >
          <Image src={ArrowSvg} css={{ height: '18px' }} alt="arrow" />
          <Text css={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>
            В магазин
          </Text>
        </Flex>
        <Box
          css={{
            width: 1000,
            flex: 1,
            m: '20px auto',
            background: '#f1f5f9',
            borderRadius: 4,
            p: 5,
          }}
        >
          <Flex css={{ w: '100%', justifyContent: 'space-between' }}>
            <Box css={{ width: '48%' }}>
              {imageSrc ? (
                <Image
                  objectFit="cover"
                  src={imageSrc}
                  css={{
                    borderRadius: 4,
                    mb: 6,
                  }}
                  alt="arrow"
                />
              ) : (
                <Skeleton css={{ width: '100%', height: '100%' }} />
              )}
            </Box>
            <Flex flexDirection={'column'} css={{ width: '48%' }}>
              <Text
                css={{ fontSize: 22, fontWeight: 600, mb: 3, color: '#111827' }}
              >
                {product.title}
              </Text>
              <Box css={{ mb: 4 }}>
                <Badge css={{ background: '#808080' }}>
                  {product.genre_name}
                </Badge>
              </Box>
              <Rating
                readOnly
                allowHalf
                colorPalette="orange"
                defaultValue={product.rating}
                size="md"
                css={{ mb: 6 }}
              />
              <Flex mb={5} justifyContent={'space-between'} alignItems={'end'}>
                <Text css={{ fontSize: 26, fontWeight: 500, color: '#111827' }}>
                  {product.price} руб.
                </Text>
                <Text css={{ fontSize: 14, fontWeight: 400, color: '#111827' }}>
                  {`Уже купили ${product.copies_sold} раз`}
                </Text>
              </Flex>
              {productInCart && (
                <Button
                  disabled
                  size={'xs'}
                  bg="#e5e7eb"
                  color="#111827"
                  _hover={{ bg: '#d1d1d1' }}
                  css={{ mb: 8 }}
                >
                  Игра уже в корзине
                </Button>
              )}
              {productInLib && (
                <Button
                  disabled
                  size={'xs'}
                  bg="#e5e7eb"
                  color="#111827"
                  _hover={{ bg: '#d1d1d1' }}
                  css={{ mb: 8 }}
                >
                  Игра уже куплена
                </Button>
              )}
              {!productInCart && !productInLib && (
                <Button
                  onClick={() => addToCart()}
                  size={'xs'}
                  bg="#e5e7eb"
                  color="#111827"
                  _hover={{ bg: '#d1d1d1' }}
                  css={{ mb: 8 }}
                >
                  Добавить в корзину
                </Button>
              )}
              <DataListRoot css={{ mb: 4 }}>
                <DataListItem
                  label={'Разработчик'}
                  color="#111827"
                  value={product.developer_name}
                />
                <DataListItem
                  label={'Дата разработки'}
                  color="#111827"
                  value={unixToUSATime(product.rel_date)}
                />
              </DataListRoot>
            </Flex>
          </Flex>
          <Blockquote
            css={{
              width: '100%',
              fontWeight: 500,
              fontSize: 18,
              mb: 8,
              color: '#111827',
            }}
            colorPalette="green"
            showDash
          >
            {product.description}
          </Blockquote>
          <Box
            css={{
              width: '100%',
              borderBottom: '3px solid #10b981',
              mb: '8px',
            }}
          ></Box>
          <Heading css={{ mb: 2, color: '#111827' }}>Отзывы</Heading>
          {reviews === null ? (
            <Text
              css={{
                fontSize: 14,
                fontWeight: 400,
                opacity: 0.5,
                color: '#111827',
              }}
            >
              Отзывов пока нет...
            </Text>
          ) : (
            renderReviews(reviews)
          )}
        </Box>
      </Flex>
    );
  return null;
};
