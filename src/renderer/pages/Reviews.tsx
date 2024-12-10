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
import { IReview } from '../types/review';

import PlusSvg from '../assets/plus.svg';
import SearchSvg from '../assets/search.svg';
import RemoveSvg from '../assets/remove.svg';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';
import { ReviewDitails } from '../components/ReviewsDitails';
import { AddReviewForm } from '../components/AddReviewForm';

export const Reviews = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<null | number>(null);
  const [deletedReviewId, setDeletedReviewId] = useState<null | number>(null);
  const [isReviewAdded, setReviewIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getReviewsAndWriteToState = async () => {
    const g = await window.api.getReviews().catch(console.error);
    setReviews(g);
  };

  const search = async (searchVal: string) => {
    const g = await window.api
      .getReviewsBySearchValue(searchVal)
      .catch(console.error);
    setReviews(g);
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getReviewsAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getReviewsAndWriteToState();
  }, [deletedReviewId]);

  const deleteGame = async () => {
    const res = await window.api.deleteReview(deletedReviewId);

    if (res) {
      toaster.create({
        description: 'Отзыв успешно удалён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Отзыв не удалён',
        type: 'error',
      });
    }
    setDeletedReviewId(null);
  };

  const renderReviews = (reviewElems: IReview[]) =>
    reviewElems.map((reviewElem) => (
      <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={() => setSelectedReviewId(reviewElem.id)}
        key={reviewElem.id}
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
        <Text
          {...{
            css: {
              width: 350,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        >{`${reviewElem.id}. consumerId: ${reviewElem.consumerId} gameId: ${reviewElem.gameId}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedReviewId(reviewElem.id),
          }}
        >
          <img style={{ height: 16 }} src={RemoveSvg} alt={'remove'} />
        </IconButton>
      </Flex>
    ));

  const renderEntrails = () => {
    if (selectedReviewId)
      return (
        <ReviewDitails
          reviewId={selectedReviewId}
          getReviewsAndWriteToState={getReviewsAndWriteToState}
        />
      );
    if (isReviewAdded)
      return (
        <AddReviewForm getReviewsAndWriteToState={getReviewsAndWriteToState} />
      );
    return <EmptyState />;
  };

  return (
    <>
      {deletedReviewId && (
        <DeleteConditionModal
          open={Boolean(deletedReviewId)}
          onClose={() => setDeletedReviewId(null)}
          onSubmit={deleteGame}
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
              <Heading>Список отзывов</Heading>
              <IconButton
                {...{
                  onClick: () => {
                    setSelectedReviewId(null);
                    setReviewIsAdded(true);
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
                  placeholder: 'Поиск отзывов',
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
          <Box css={scrollBarStyles}>{renderReviews(reviews)}</Box>
        </Flex>
        <Box css={{ flex: 1 }}>{renderEntrails()}</Box>
      </Flex>
    </>
  );
};
