import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ILibProduct } from '../types/product';
import { EmptyState } from '../components/EmpatyState';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { ShopLibraryDitails } from '../components/ShopLibraryDitails';
import a from '../axios';

export const Library = () => {
  const [libProducts, setLibProducts] = useState<null | ILibProduct[]>(null);
  const [selectedProductId, setSelectedProductId] = useState<null | number>(
    null,
  );

  const getLibProducts = async () => {
    try {
      const res = await a.get<ILibProduct[]>('/software/library_items/');

      setLibProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getLibProducts();
  }, []);

  const renderProducts = (productsElems: ILibProduct[]) =>
    productsElems.map((productElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedProductId(productElem.id)}
        key={productElem.id}
        css={{
          pl: 6,
          pr: 4.5,
          borderBottom: '1px solid #2f3b43',
          minHeight: 50,
          color: '#fff',
          '&:hover': {
            background: '#fff',
            color: '#111827',
          },
          cursor: 'pointer',
        }}
      >
        <Text>{productElem.title}</Text>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedProductId && libProducts)
      return (
        <ShopLibraryDitails
          productObj={
            libProducts.find(
              (obj) => obj.id === selectedProductId,
            ) as ILibProduct
          }
        />
      );
    return <EmptyState />;
  };

  return (
    <Flex css={{ flex: 1, h: '94.5%' }}>
      <Flex
        css={{
          width: 470,
          height: '100%',
          background: '#10b981',
          borderRight: '1px solid #2f3b43',
        }}
        direction={'column'}
      >
        <Flex
          direction={'column'}
          css={{
            height: '60px',
            borderBottom: '3px solid #2f3b43',
            py: 3,
            px: 5,
          }}
        >
          <Flex
            width={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={8}
          >
            <Heading css={{ color: '#fff' }}>Моя библиотека</Heading>
          </Flex>
        </Flex>
        <Box css={scrollBarStyles}>
          {libProducts ? renderProducts(libProducts) : null}
        </Box>
      </Flex>
      <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
    </Flex>
  );
};
