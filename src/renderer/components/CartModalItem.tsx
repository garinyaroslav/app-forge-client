import { FC, useEffect, useState } from 'react';
import { Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import { IProduct } from '../types/product';
import a from '../axios';

import CrossSvg from '../assets/cross.svg';
import { base64ToBlob } from '@/utils/base64ToBlob';

type TProductObj = IProduct & { cart_item_id: number };

interface CartModalItemProps {
  productObj: TProductObj;
  getItemsAndWriteToState: () => void;
}

export const CartModalItem: FC<CartModalItemProps> = ({
  productObj,
  getItemsAndWriteToState,
}) => {
  const [imageSrc, setImageSrc] = useState<null | string>(null);

  useEffect(() => {
    const blob = base64ToBlob(productObj.image, 'image/png');
    setImageSrc(URL.createObjectURL(blob));

    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, []);

  const deleteFromCart = async (cart_item_id: number) => {
    await a.delete('/cart_item/my/', { params: { id: cart_item_id } });

    getItemsAndWriteToState();
  };

  return (
    <Flex css={{ w: '100%', h: '90px', border: '1px solid #fff', mb: 4 }}>
      {imageSrc ? (
        <Image
          css={{ h: '100%', w: '90px' }}
          objectFit="cover"
          src={imageSrc}
          alt={'productImage'}
        />
      ) : (
        <Skeleton css={{ h: '100%', w: '90px' }} />
      )}
      <Box css={{ h: '100%', w: '100%', p: 3 }}>
        <Flex justifyContent={'space-between'}>
          <Text css={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
            {productObj.title}
          </Text>
          <Image
            onClick={() => deleteFromCart(productObj.cart_item_id)}
            css={{ w: '12px', cursor: 'pointer' }}
            src={CrossSvg}
            alt={'close'}
          />
        </Flex>
        <Text css={{ fontSize: 14 }}>{`${productObj.price} руб.`}</Text>
      </Box>
    </Flex>
  );
};
