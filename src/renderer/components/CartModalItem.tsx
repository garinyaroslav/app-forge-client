import { FC, useEffect, useState } from 'react';
import { Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import { IGame } from '../types/game';

import CrossSvg from '../assets/cross.svg';

type TGameObj = IGame & { cartItemId: number };

interface CartModalItemProps {
  gameObj: TGameObj;
  getItemsAndWriteToState: () => void;
}

export const CartModalItem: FC<CartModalItemProps> = ({
  gameObj,
  getItemsAndWriteToState,
}) => {
  const [imageSrc, setImageSrc] = useState<null | string>(null);

  useEffect(() => {
    const blob = new Blob([gameObj.image], {
      type: 'image/png',
    });
    setImageSrc(URL.createObjectURL(blob));

    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, []);

  const deleteFromCart = async (cartItemId: number) => {
    await window.api.deleteCartItem(cartItemId).catch(console.error);
    getItemsAndWriteToState();
  };

  return (
    <Flex css={{ w: '100%', h: '90px', border: '1px solid #fff', mb: 4 }}>
      {imageSrc ? (
        <Image objectFit="cover" src={imageSrc} alt={'gameImage'} />
      ) : (
        <Skeleton css={{ h: '100%', w: '90px' }} />
      )}
      <Box css={{ h: '100%', w: '100%', p: 3 }}>
        <Flex justifyContent={'space-between'}>
          <Text css={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
            {gameObj.title}
          </Text>
          <Image
            onClick={() => deleteFromCart(gameObj.cartItemId)}
            css={{ w: '12px', cursor: 'pointer' }}
            src={CrossSvg}
            alt={'close'}
          />
        </Flex>
        <Text css={{ fontSize: 14 }}>{`${gameObj.price} руб.`}</Text>
      </Box>
    </Flex>
  );
};
