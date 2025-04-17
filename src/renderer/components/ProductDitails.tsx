import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Flex,
  Image,
  Skeleton,
  Input,
  Text,
  Heading,
  Textarea,
  Button,
  Box,
} from '@chakra-ui/react';
import { IProduct } from '../types/product';
import { IProductForm, TProductForm } from '../types/productForm';
import { scrollBarStyles } from '../../utils/scrollBarStyles';
import { toaster } from './ui/toaster';
import { unixToUSATime } from '../../utils/unixToUSADate';
import { USADateToUnix } from '../../utils/USADateToUnix';
import { IGenre } from '../types/genre';
import a from '../../renderer/axios';
import { base64ToBlob } from '../../utils/base64ToBlob';
import { fileToBase64 } from '../../utils/fileToBase64';

interface ProductDitaildProps {
  productId: number;
  getProductsAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор продукта', val: 'id' },
  { lab: 'Название продукта', val: 'title' },
  { lab: 'Описание продукта', val: 'description' },
  { lab: 'Разработчик', val: 'developer_name' },
  { lab: 'Рейтинг', val: 'rating' },
  { lab: 'Цена', val: 'price' },
  { lab: 'Продано копий', val: 'copies_sold' },
  { lab: 'Идентификатор жанра продукта', val: 'genre' },
  { lab: 'Дата релиза', val: 'rel_date' },
];

export const ProductDitails: FC<ProductDitaildProps> = ({
  productId,
  getProductsAndWriteToState,
}) => {
  const [product, setProduct] = useState<null | IProduct>(null);
  const [imageSrc, setImageSrc] = useState<null | string>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [defaultImageFileList, setDefaultImageFileList] =
    useState<null | FileList>(null);
  const [defaultDate, setDefaultDate] = useState<null | string>(null);
  const [genreOptions, setGenreOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const { register, handleSubmit, reset } = useForm<IProductForm>({
    values: {
      ...product,
      image: defaultImageFileList,
      rel_date: defaultDate,
    } as unknown as IProductForm,
  });

  const getProduct = async () => {
    let resData: null | IProduct = null;

    try {
      const res = await a.get<IProduct>(`/software/?id=${productId}`);
      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (!resData) return;

    const blob = base64ToBlob(resData.image, 'image/png');

    setImageSrc(URL.createObjectURL(blob));

    const file = new File([blob], 'oldimage.png', {
      type: 'image/png',
    });
    const dt = new DataTransfer();
    dt.items.add(file);

    setDefaultImageFileList(dt.files);
    setDefaultDate(unixToUSATime(resData.rel_date));
    setProduct(resData);
  };

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

  const onCancel = async () => {
    await reset();
    getProduct();
    getProductsAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IProductForm> = async (data) => {
    const imageBase64 = await fileToBase64(data.image.item(0) as File);

    if (
      Number.isNaN(Number(data.rating)) &&
      Number.isNaN(Number(data.price)) &&
      Number.isNaN(Number(data.copies_sold)) &&
      Number.isNaN(Number(data.genre))
    ) {
      toaster.create({
        description: 'Продукт не был обновлен',
        type: 'error',
      });
      return;
    }

    let resData: null | IProduct = null;

    try {
      let res = await a.put<IProduct>(`/software/?id=${data.id}`, {
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
        description: 'Продукт успешно обновлён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Продукт не был обновлен',
        type: 'error',
      });
    }

    onCancel();
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
          {...register(field)}
          {...{
            disabled: !isEdited,
            variant: 'subtle',
            css: { width: 250, height: 300, ...scrollBarStyles },
            colorPalette: 'green',
            bg: '#e5e7eb',
            color: '#111827',
          }}
        />
      );
    if (field === 'rel_date')
      return (
        <Input
          type="date"
          {...register(field as TProductForm)}
          {...{
            variant: 'subtle',
            disabled: !isEdited,
            css: { width: 250 },
            colorPalette: 'green',
            bg: '#e5e7eb',
            color: '#111827',
          }}
        />
      );
    if (field === 'genre')
      return (
        <select
          {...register(field as TProductForm, { required: true })}
          disabled={!isEdited}
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
        {...register(field as TProductForm)}
        {...{
          variant: 'subtle',
          disabled: !isEdited || field === 'id',
          css: { width: 250 },
          colorPalette: 'green',
          bg: '#e5e7eb',
          color: '#111827',
        }}
      />
    );
  };

  useEffect(() => {
    getProduct();
    getGenresAndWriteToState();
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [productId]);

  if (product)
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '70px' }}
      >
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5 }}>Свойства</Heading>
          {fields.map((field) => (
            <Flex
              key={field.val}
              alignItems={'center'}
              justifyContent={'space-between'}
              css={{ width: 500 }}
            >
              <Text color="#111827">{field.lab}</Text>
              {renderFieldEntrail(field.val)}
            </Flex>
          ))}
        </Flex>
        <Flex
          direction={'column'}
          alignItems={'flex-end'}
          justifyContent={'space-between'}
        >
          <Box>
            <Heading css={{ mb: 5 }}>Изображение приложения</Heading>
            {imageSrc ? (
              <>
                <Image
                  css={{ height: 300, width: 350, mb: 5 }}
                  src={imageSrc}
                  alt="photo"
                />
                <input
                  hidden={!isEdited}
                  {...register('image')}
                  onChange={handleChangeFiles}
                  type="file"
                  accept="image/*"
                  alt="image"
                />
              </>
            ) : (
              <Skeleton css={{ height: 300, width: 350 }} />
            )}
          </Box>
          {isEdited ? (
            <Flex w={'100%'} justifyContent={'space-between'}>
              <Button onClick={onCancel} css={{ width: 150 }}>
                Отмена
              </Button>
              <Button type="submit" css={{ width: 150 }}>
                Готово
              </Button>
            </Flex>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => setIsEdited(true)}
                css={{ width: 200 }}
              >
                Изменить
              </Button>
              <Button hidden type="submit">
                .
              </Button>
            </>
          )}
        </Flex>
      </form>
    );
  return null;
};
