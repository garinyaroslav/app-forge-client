import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Flex,
  Image,
  Input,
  Text,
  Heading,
  Textarea,
  Button,
  Box,
} from '@chakra-ui/react';
import { EmptyState } from './ui/empty-state';
import { IProductForm, TProductForm } from '../types/productForm';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { Toaster, toaster } from './ui/toaster';
import { USADateToUnix } from '../../utils/USADateToUnix';
import { IGenre } from '../types/genre';
import a from '../../renderer/axios';
import { fileToBase64 } from '../../utils/fileToBase64';
import { IProduct } from '../types/product';

interface AddProductFormProps {
  getProductsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Название продукта', val: 'title' },
  { lab: 'Описание продукта', val: 'description' },
  { lab: 'Разработчик', val: 'developer_name' },
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Изображение продукта', val: 'image' },
  { lab: 'Цена', val: 'price' },
  { lab: 'Продано копий', val: 'copies_sold' },
  { lab: 'Жанр', val: 'genre' },
  { lab: 'Дата релиза', val: 'rel_date' },
];

export const AddProductForm: FC<AddProductFormProps> = ({
  getProductsAndWriteToState,
}) => {
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [genreOptions, setGenreOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { register, handleSubmit, reset } = useForm<IProductForm>({});

  const getGenresAndWriteToState = async () => {
    let resData: null | IGenre[] = null;

    try {
      const res = await a.get<IGenre[]>(`/genre/`);
      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (!resData) return;

    setGenreOptions(
      resData.map((genreObj: IGenre) => ({
        value: genreObj.id,
        label: genreObj.name,
      })),
    );
  };

  useEffect(() => {
    getGenresAndWriteToState();
  }, []);

  const onSubmit: SubmitHandler<IProductForm> = async (data) => {
    const imageBase64 = await fileToBase64(data.image.item(0) as File);

    if (
      Number.isNaN(Number(data.rating)) &&
      Number.isNaN(Number(data.price)) &&
      Number.isNaN(Number(data.copies_sold)) &&
      Number.isNaN(Number(data.genre))
    ) {
      toaster.create({
        description: 'Продукт не был добавлен',
        type: 'error',
      });
      return;
    }

    let resData: null | IProduct = null;

    try {
      let res = await a.post<IProduct>(`/software/`, {
        title: data.title,
        description: data.description,
        developer_name: data.developer_name,
        rating: Number(data.rating),
        price: Number(data.price),
        copies_sold: Number(data.copies_sold),
        genre: Number(data.genre),
        rel_date: USADateToUnix(data.rel_date),
        image: imageBase64,
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Продукт успешно добавлен',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Продукт не добавлен',
        type: 'error',
      });
    }

    reset();
    setImageSrc(null);
    getProductsAndWriteToState();
  };

  const handleChangeFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'description')
      return (
        <Textarea
          {...register(field, { required: true })}
          {...{
            variant: 'subtle',
            css: { width: 250, height: 250, ...scrollBarStyles },
          }}
        />
      );
    if (field === 'image')
      return (
        <input
          {...register('image', { required: true })}
          onChange={handleChangeFiles}
          type="file"
          accept="image/*"
          alt="image"
        />
      );

    if (field === 'rel_date')
      return (
        <Input
          type="date"
          {...register(field as TProductForm, { required: true })}
          {...{
            variant: 'subtle',
            css: { width: 250 },
          }}
        />
      );

    if (field === 'genre')
      return (
        <select
          {...register(field as TProductForm, { required: true })}
          style={{
            width: 250,
            background: '#18181b',
            borderRadius: '4px',
            padding: 6,
          }}
        >
          {genreOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    return (
      <Input
        {...register(field as TProductForm, { required: true })}
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '70px' }}
      >
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {renderFields()}
        </Flex>
        <Flex
          direction={'column'}
          alignItems={'flex-end'}
          justifyContent={'space-between'}
        >
          <Box>
            <Heading css={{ mb: 5 }}>Изображение продукта</Heading>
            {imageSrc ? (
              <Image
                css={{ height: 300, width: 350 }}
                src={imageSrc}
                alt="photo"
              />
            ) : (
              <EmptyState
                {...{
                  css: { height: 300, width: 350 },
                  title: 'Картинки нет',
                  description: 'Выберите картинку для продукта',
                }}
              />
            )}
          </Box>
          <Button type="submit" css={{ width: 200 }}>
            Добавить
          </Button>
        </Flex>
      </form>
    </>
  );
};
