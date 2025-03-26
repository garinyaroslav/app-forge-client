import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button, Textarea } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { IReview, TReview } from '../types/review';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import a from '../../renderer/axios';

interface AddReviewFormProps {
  getReviewsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Текст комментария', val: 'text_comment' },
  { lab: 'Идентификатор продукта', val: 'product' },
  { lab: 'Идентификатор пользователя', val: 'consumer' },
];

export const AddReviewForm: FC<AddReviewFormProps> = ({
  getReviewsAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<IReview>();

  const onSubmit: SubmitHandler<IReview> = async (data) => {
    let resData: null | IReview = null;

    if (
      Number.isNaN(Number(data.product)) &&
      Number.isNaN(Number(data.consumer))
    ) {
      toaster.create({
        description: 'Отзыв не добавлен',
        type: 'error',
      });
      return;
    }

    try {
      let res = await a.post<IReview>(`/review/`, {
        rating: data.rating,
        text_comment: data.text_comment,
        product: Number(data.product),
        consumer: Number(data.consumer),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Отзыв успешно добавлен',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Отзыв не добавлен',
        type: 'error',
      });
    }

    reset();
    getReviewsAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'text_comment')
      return (
        <Textarea
          {...register(field, { required: true })}
          {...{
            variant: 'subtle',
            css: { width: 250, height: 250, ...scrollBarStyles },
          }}
        />
      );
    return (
      <Input
        {...register(field as TReview, { required: true })}
        {...{
          variant: 'subtle',
          css: { width: 250 },
        }}
      />
    );
  };

  const renderFields = () => {
    return fields.map((field) => (
      <Flex
        key={field.val}
        alignItems={'center'}
        justifyContent={'space-between'}
        css={{ width: 500 }}
      >
        <Text>{field.lab}</Text>
        {renderFieldEntrail(field.val)}
      </Flex>
    ));
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {renderFields()}
          <Button type="submit" css={{ width: 200, ml: '250px', mt: 5 }}>
            Добавить
          </Button>
        </Flex>
      </form>
    </>
  );
};
