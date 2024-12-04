import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  createListCollection,
  Flex,
  Input,
  Portal,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValueText,
  Text,
} from '@chakra-ui/react';
import { GameCard } from '../components/GameCard';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { GameSort, IGame } from '../types/game';
import { SelectRoot } from '../components/ui/select';

import CartSvg from '../assets/cart.svg';
import SearchSvg from '../assets/search.svg';
import { InputGroup } from '../components/ui/input-group';
import { CartModal } from '../components/CartModal';

const options = createListCollection({
  items: [
    { label: 'По популярности', value: GameSort.byPopularity },
    { label: 'По новизне', value: GameSort.byNovelty },
  ],
});

export const Shop = () => {
  const [games, setGames] = useState<
    (IGame & { gameGenres: { genreName: string } })[]
  >([]);
  const [sort, setSort] = useState<GameSort>(GameSort.byNovelty);
  const [searchValue, setSearchValue] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getGamesAndWriteToState = async () => {
    const g = await window.api
      .getGamesList(sort, searchValue)
      .catch(console.error);
    setGames(g);
  };

  useEffect(() => {
    getGamesAndWriteToState();
  }, [sort, searchValue]);

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
  };

  return (
    <>
      {isCartOpen && (
        <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
      <Flex css={{ height: 'calc(100% - 100px)' }}>
        <Box
          css={{
            width: 1000,
            height: 'calc(100% - 15px)',
            m: '30px auto',
          }}
        >
          <Flex justifyContent={'space-between'} mb={4}>
            <Text css={{ fontSize: 24, fontWeight: 600 }}>Все игры</Text>
            <InputGroup
              width={400}
              height={'36px'}
              startElement={
                <img style={{ height: 15 }} src={SearchSvg} alt={'search'} />
              }
            >
              <Input
                {...{
                  css: { height: '36px' },
                  value: searchValue,
                  onChange: onChangeSearchValue,
                  variant: 'subtle',
                  placeholder: 'Поиск игр',
                }}
              />
            </InputGroup>
            <Flex alignItems={'center'}>
              <Text css={{ mr: 3, fontWeight: 600 }}>Сортировка:</Text>
              <SelectRoot
                value={[sort]}
                onValueChange={(e: { value: GameSort[] }) => {
                  setSort(e.value[0] as GameSort);
                }}
                variant={'subtle'}
                collection={options}
                size="sm"
                width="170px"
                mr="10px"
              >
                <SelectTrigger>
                  <SelectValueText {...{ placeholder: '' }} />
                </SelectTrigger>
                <Portal>
                  <SelectPositioner>
                    <SelectContent>
                      <SelectItem {...{ item: options.items[1] }}>
                        По новизне
                      </SelectItem>
                      <SelectItem {...{ item: options.items[0] }}>
                        По популярности
                      </SelectItem>
                    </SelectContent>
                  </SelectPositioner>
                </Portal>
              </SelectRoot>
              <Button
                onClick={() => setIsCartOpen(true)}
                variant={'subtle'}
                height={'36px'}
              >
                <img src={CartSvg} style={{ height: '20px' }} alt="arrow" />
              </Button>
            </Flex>
          </Flex>
          <Box css={{ height: '94%', ...scrollBarStyles }}>
            {games.map((game) => (
              <GameCard key={game.id} gameObj={game} />
            ))}
          </Box>
        </Box>
      </Flex>
    </>
  );
};
