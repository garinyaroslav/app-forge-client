import { FC } from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';
import { IReviewObj } from '../types/review';

import AvatarSvg from '../assets/avatar.svg';
import { Rating } from './ui/rating';

interface ProductShopReviewProps {
  review: IReviewObj;
}

export const ProductShopReview: FC<ProductShopReviewProps> = ({ review }) => {
  return (
    <Flex css={{ w: '100%', mb: 6 }}>
      <Image css={{ h: '30px' }} src={AvatarSvg} alt="avatar" />
      <Flex css={{ ml: 3, flexDirection: 'column' }}>
        <Flex css={{ mb: 4, alignItems: 'center' }}>
          <Text css={{ mr: 6, fontSize: 18, fontWeight: 600 }}>
            {review.consumer__last_name} {review.consumer__first_name}
          </Text>
          <Text css={{ mr: 2, fontSize: 14 }}>Оценил на:</Text>
          <Rating
            readOnly
            allowHalf
            colorPalette="orange"
            defaultValue={review.rating}
            size="xs"
          />
        </Flex>
        <Text>{review.text_comment}</Text>
      </Flex>
    </Flex>
  );
};
