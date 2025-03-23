import { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Group,
  Heading,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { Toaster, toaster } from '../components/ui/toaster';
import { EmptyState } from '../components/EmpatyState';
import { IProduct } from '../types/product';

import PlusSvg from '../assets/plus.svg';
import SearchSvg from '../assets/search.svg';
import RemoveSvg from '../assets/remove.svg';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';
import a from '../../renderer/axios';
import { ProductDitails } from '../components/ProductDitails';
import { AddProductForm } from '../components/AddProductForm';

export const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<null | number>(
    null,
  );
  const [deletedProductId, setDeletedProductId] = useState<null | number>(null);
  const [isProductAdded, setProductIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getProductsAndWriteToState = async () => {
    try {
      const res = await a.get<IProduct[]>('/software/');
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const search = async (searchVal: string) => {
    try {
      const res = await a.get<IProduct[]>(`/software/?search=${searchVal}`);
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getProductsAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getProductsAndWriteToState();
  }, [deletedProductId]);

  const deleteProduct = async () => {
    let resData: IProduct | null = null;
    try {
      const res = await a.delete(`/software/?id=${deletedProductId}`);
      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData !== null) {
      toaster.create({
        description: 'Прдукт успешно удалён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Продукт не удалён',
        type: 'error',
      });
    }
    setDeletedProductId(null);
  };

  const renderProducts = (productsElems: IProduct[]) =>
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
          minHeight: 68,
          '&:hover': {
            background: '#222e35',
          },
          cursor: 'pointer',
        }}
      >
        <Text>{`${productElem.id}. ${productElem.title}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedProductId(productElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedProductId)
      return (
        <ProductDitails
          productId={selectedProductId}
          getProductsAndWriteToState={getProductsAndWriteToState}
        />
      );
    if (isProductAdded)
      return (
        <AddProductForm
          getProductsAndWriteToState={getProductsAndWriteToState}
        />
      );
    return <EmptyState />;
  };

  return (
    <>
      {deletedProductId && (
        <DeleteConditionModal
          open={Boolean(deletedProductId)}
          onClose={() => setDeletedProductId(null)}
          onSubmit={deleteProduct}
        />
      )}
      <Toaster />
      <Flex css={{ flex: 1 }}>
        <Flex
          css={{
            width: 470,
            height: '100%',
            background: '#111b21',
            borderRight: '1px solid #2f3b43',
          }}
          direction={'column'}
        >
          <Flex
            direction={'column'}
            css={{
              height: 150,
              borderBottom: '1px solid #2f3b43',
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
              <Heading>Список продуктов</Heading>
              <IconButton
                {...{
                  onClick: () => {
                    setSelectedProductId(null);
                    setProductIsAdded(true);
                  },
                  variant: 'surface',
                }}
              >
                <img style={{ height: 12 }} src={PlusSvg} alt={'plus'} />
              </IconButton>
            </Flex>
            <Group {...{ attached: true, flex: 1 }}>
              <Input
                {...{
                  value: searchValue,
                  onChange: onChangeSearchValue,
                  variant: 'outline',
                  placeholder: 'Поиск продуктов',
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') search(searchValue);
                  },
                }}
              />
              <IconButton
                {...{ onClick: () => search(searchValue), variant: 'surface' }}
              >
                <img style={{ height: 15 }} src={SearchSvg} alt={'search'} />
              </IconButton>
            </Group>
          </Flex>
          <Box css={scrollBarStyles}>{renderProducts(products)}</Box>
        </Flex>
        <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
      </Flex>
    </>
  );
};
