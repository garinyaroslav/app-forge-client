import { useEffect, useState } from 'react';
import { Box, Flex, Text, Image, Badge, Skeleton } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { IGame } from '../types/game';

import ArrowSvg from '../assets/arrowLeft.svg';
import { Rating } from './ui/rating';
import { Blockquote } from './ui/blockquote';
import { DataListItem, DataListRoot } from './ui/data-list';
import { Button } from './ui/button';

export const GameShopDitails = () => {
  const nav = useNavigate();
  const { gameId } = useParams();
  const [game, setGame] = useState<
    null | (IGame & { gameGenres: { genreName: string } })
  >(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);

  const getGameAndWriteToState = async () => {
    const g = await window.api.getGamesListElem(gameId).catch(console.error);
    setGame(g[0]);

    const blob = new Blob([g[0].image], {
      type: 'image/png',
    });
    setImageSrc(URL.createObjectURL(blob));
  };

  useEffect(() => {
    getGameAndWriteToState();

    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, []);

  if (game)
    return (
      <Flex
        flexDirection={'column'}
        alignItems={'center'}
        css={{ height: 'calc(100% - 50px)' }}
      >
        <Flex
          onClick={() => nav('/user/shop')}
          css={{
            gap: 3,
            alignItems: 'center',
            cursor: 'pointer',
            width: 1000,
            mt: 3,
          }}
        >
          <Image src={ArrowSvg} css={{ height: '18px' }} alt="arrow" />
          <Text css={{ fontWeight: 600, fontSize: 14 }}>В магазин</Text>
        </Flex>
        <Box
          css={{
            width: 1000,
            height: 'calc(100% - 15px)',
            m: '40px auto',
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
              <Button onClick={() => {}} size={'xs'} css={{ mb: 8 }}>
                Добавить в корзину
              </Button>
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
            css={{ width: '100%', fontWeight: 500, fontSize: 18 }}
            showDash
          >
            {game.description}
          </Blockquote>
        </Box>
      </Flex>
    );
  return null;
};
