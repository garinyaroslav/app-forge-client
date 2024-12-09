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
import { IGame } from '../types/game';

import ArrowSvg from '../assets/arrowLeft.svg';
import { Rating } from './ui/rating';
import { Blockquote } from './ui/blockquote';
import { DataListItem, DataListRoot } from './ui/data-list';
import { Button } from './ui/button';
import { Toaster, toaster } from './ui/toaster';
import { IReviewObj } from '../types/review';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { GameShopReview } from './GameShopReview';

export const GameShopDitails = () => {
  const nav = useNavigate();
  const { gameId } = useParams();
  const [game, setGame] = useState<
    null | (IGame & { gameGenres: { genreName: string } })
  >(null);
  const [reviews, setReviews] = useState<null | IReviewObj[]>(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [gameInCart, setGameInCart] = useState(false);
  const [gameInLib, setGameInLib] = useState(false);

  const getGameAndWriteToState = async () => {
    const g = await window.api.getGamesListElem(gameId).catch(console.error);
    setGame(g[0]);

    const blob = new Blob([g[0].image], {
      type: 'image/png',
    });
    setImageSrc(URL.createObjectURL(blob));
  };

  const getReviewsAndWriteToState = async () => {
    const r = await window.api.getReviewsByGameId(gameId).catch(console.error);
    if (r.length === 0) setReviews(null);
    else setReviews(r);
  };

  const makeChecks = async () => {
    const uid = await Number(localStorage.getItem('uid'));

    const hasGameInCart = await window.api
      .getGameFromUserCart(uid, gameId)
      .catch(console.error);

    if (hasGameInCart.length > 0) {
      setGameInCart(true);
      return;
    }

    const hasGameInLib = await window.api
      .getGameFromUserLib(uid, gameId)
      .catch(console.error);

    if (hasGameInLib.length > 0) {
      setGameInLib(true);
    }
  };

  const addToCart = async () => {
    const uid = await Number(localStorage.getItem('uid'));

    const addRes = await window.api.addGameInUserCart(uid, gameId);
    if (addRes) {
      toaster.create({
        description: 'Игра добавлена в корзину',
        type: 'success',
      });
    }
    makeChecks();
  };

  useEffect(() => {
    setGameInLib(false);
    setGameInCart(false);
    makeChecks();
    getGameAndWriteToState();
    getReviewsAndWriteToState();
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, []);

  const renderReviews = (reviewsObj: IReviewObj[]) => {
    return reviewsObj.map((reviewObj) => (
      <GameShopReview key={reviewObj.id} review={reviewObj} />
    ));
  };

  if (game)
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
          <Text css={{ fontWeight: 600, fontSize: 14 }}>В магазин</Text>
        </Flex>
        <Box
          css={{
            width: 1000,
            flex: 1,
            m: '20px auto',
            background: '#111b21',
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
              <Text css={{ fontSize: 22, fontWeight: 600, mb: 3 }}>
                {game.title}
              </Text>
              <Box css={{ mb: 4 }}>
                <Badge css={{ background: '#808080' }}>
                  {game.gameGenres.genreName}
                </Badge>
              </Box>
              <Rating
                readOnly
                allowHalf
                colorPalette="orange"
                defaultValue={game.rating}
                size="md"
                css={{ mb: 6 }}
              />
              <Flex mb={5} justifyContent={'space-between'} alignItems={'end'}>
                <Text css={{ fontSize: 26, fontWeight: 500 }}>
                  {game.price} руб.
                </Text>
                <Text css={{ fontSize: 14, fontWeight: 400 }}>
                  {`Уже купили ${game.copiesSold} раз`}
                </Text>
              </Flex>
              {gameInCart && (
                <Button disabled size={'xs'} css={{ mb: 8 }}>
                  Игра уже в корзине
                </Button>
              )}
              {gameInLib && (
                <Button disabled size={'xs'} css={{ mb: 8 }}>
                  Игра уже куплена
                </Button>
              )}
              {!gameInCart && !gameInLib && (
                <Button onClick={() => addToCart()} size={'xs'} css={{ mb: 8 }}>
                  Добавить в корзину
                </Button>
              )}
              <DataListRoot css={{ mb: 4 }}>
                <DataListItem
                  label={'Разработчик'}
                  value={game.developerName}
                />
                <DataListItem
                  label={'Дата разработки'}
                  value={new Date(game.relDate * 1000).toLocaleDateString()}
                />
              </DataListRoot>
            </Flex>
          </Flex>
          <Blockquote
            css={{ width: '100%', fontWeight: 500, fontSize: 18, mb: 8 }}
            showDash
          >
            {game.description}
          </Blockquote>
          <Separator css={{ mb: 2 }} />
          <Heading css={{ mb: 2 }}>Отзывы</Heading>
          {reviews === null ? (
            <Text css={{ fontSize: 14, fontWeight: 400, opacity: 0.5 }}>
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
