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
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { DeleteConditionModal } from '../components/DeleteConditionModal';
import { ReviewDitails } from '../components/ReviewsDitails';
import { AddReviewForm } from '../components/AddReviewForm';
import a from '../../renderer/axios';

import PlusSvg from '../assets/plus.svg';
import SearchSvg from '../assets/searchWhite.svg';
import RemoveSvg from '../assets/remove.svg';

export const Reviews = () => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<null | number>(null);
  const [deletedReviewId, setDeletedReviewId] = useState<null | number>(null);
  const [isReviewAdded, setReviewIsAdded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const getReviewsAndWriteToState = async () => {
    try {
      const res = await a.get<IReview[]>('/review/');
      setReviews(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const search = async (searchVal: string) => {
    try {
      const res = await a.get<IReview[]>(`/review/?search=${searchVal}`);
      setReviews(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length === 0) getReviewsAndWriteToState();
    setSearchValue(val);
  };

  useEffect(() => {
    getReviewsAndWriteToState();
  }, [deletedReviewId]);

  const deleteReview = async () => {
    let resData: IReview | null = null;

    try {
      const res = await a.delete(`/review/?id=${deletedReviewId}`);
      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData !== null) {
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
            background: '#fff',
            color: '#111827',
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
        >{`${reviewElem.id}. Отзыв пользователя: ${reviewElem.consumer} на продукт: ${reviewElem.product}`}</Text>
        <IconButton
          {...{
            variant: 'ghost',
            onClick: () => setDeletedReviewId(reviewElem.id),
          }}
        >
          <img style={{ height: 20 }} src={RemoveSvg} alt={'search'} />
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
          onSubmit={deleteReview}
        />
      )}
      <Toaster />
      <Flex css={{ flex: 1 }}>
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
                  colorPalette: 'green',
                  bg: '#e5e7eb',
                  color: '#111827',
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') search(searchValue);
                  },
                  css: {
                    border: 'none',
                  },
                }}
              />
              <IconButton
                {...{ onClick: () => search(searchValue), variant: 'surface' }}
              >
                <img style={{ height: 20 }} src={SearchSvg} alt={'search'} />
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
