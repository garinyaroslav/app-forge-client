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
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { ProductSort, IProduct } from '../types/product';
import { SelectRoot } from '../components/ui/select';

import CartSvg from '../assets/cart.svg';
import SearchSvg from '../assets/search.svg';
import { InputGroup } from '../components/ui/input-group';
import { CartModal } from '../components/CartModal';
import { ProductCard } from '../components/ProductCard';
import a from '../axios';
import useDebounce from '@/utils/useDebounce';

const options = createListCollection({
  items: [
    { label: 'По популярности', value: ProductSort.byPopularity },
    { label: 'По новизне', value: ProductSort.byNovelty },
  ],
});

export const Shop = () => {
  const [products, setProducts] = useState<
    (IProduct & { genre_name: string })[]
  >([]);
  const [sort, setSort] = useState<ProductSort>(ProductSort.byNovelty);
  const [searchValue, setSearchValue] = useState('');
  const deboucedSearchValue = useDebounce(searchValue, 750);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getProductsAndWriteToState = async () => {
    const params =
      deboucedSearchValue.length > 0
        ? {
            sort,
            search: deboucedSearchValue,
          }
        : { sort };

    try {
      const res = await a.get<(IProduct & { genre_name: string })[]>(
        '/software/list/',
        { params },
      );
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const closeCartModal = async () => {
    await setIsCartOpen(false);
    await getProductsAndWriteToState();
  };
  useEffect(() => {
    getProductsAndWriteToState();
  }, [sort, deboucedSearchValue]);

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
  };

  const renderProductCarts = (items: (IProduct & { genre_name: string })[]) => {
    return items.map((item) => <ProductCard key={item.id} productObj={item} />);
  };

  return (
    <>
      {isCartOpen && <CartModal open={isCartOpen} onClose={closeCartModal} />}
      <Flex css={{ height: 'calc(100% - 100px)' }}>
        <Box
          css={{
            width: 1000,
            height: 'calc(100% - 15px)',
            m: '30px auto',
          }}
        >
          <Flex justifyContent={'space-between'} mb={4}>
            <Text css={{ fontSize: 24, fontWeight: 600, color: '#374151' }}>
              Приложения
            </Text>
            <InputGroup
              width={400}
              height={'36px'}
              startElement={
                <img style={{ height: 15 }} src={SearchSvg} alt={'search'} />
              }
            >
              <Input
                {...{
                  colorPalette: 'green',
                  bg: '#e5e7eb',
                  css: {
                    height: '36px',
                    color: '#000',
                    '&::placeholder': { color: '#000' },
                  },
                  value: searchValue,
                  onChange: onChangeSearchValue,
                  variant: 'subtle',
                  placeholder: 'Поиск',
                }}
              />
            </InputGroup>
            <Flex alignItems={'center'}>
              <Text css={{ mr: 3, fontWeight: 600, color: '#111827' }}>
                Сортировка:
              </Text>
              <SelectRoot
                value={[sort]}
                onValueChange={(e: { value: ProductSort[] }) => {
                  setSort(e.value[0] as ProductSort);
                }}
                variant={'subtle'}
                colorPalette="green"
                collection={options}
                size="sm"
                width="170px"
                mr="10px"
              >
                <SelectTrigger {...{ bg: '#e5e7eb' }}>
                  <SelectValueText {...{ placeholder: '', color: '#000' }} />
                </SelectTrigger>
                <Portal>
                  <SelectPositioner>
                    <SelectContent {...{ bg: '#e5e7eb' }}>
                      <SelectItem
                        {...{ item: options.items[1], color: '#000' }}
                      >
                        По новизне
                      </SelectItem>
                      <SelectItem
                        {...{ item: options.items[0], color: '#000' }}
                      >
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
            {renderProductCarts(products)}
          </Box>
        </Box>
      </Flex>
    </>
  );
};
