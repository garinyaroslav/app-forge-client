import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { ILibrary, TLibrary } from '../types/library';
import { unixToUSATime } from '../../utils/unixToUSADate';
import { USADateToUnix } from '../../utils/USADateToUnix';
import a from '../../renderer/axios';

interface LibraryDitailsProps {
  libraryId: number;
  getLibrariesAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор библиотеки', val: 'id' },
  { lab: 'Идентификатор продукта', val: 'product' },
  { lab: 'Идентификатор пользователя', val: 'consumer' },
  { lab: 'Дата добавления', val: 'added_date' },
];

export const LibraryDitails: FC<LibraryDitailsProps> = ({
  libraryId,
  getLibrariesAndWriteToState,
}) => {
  const [library, setLibrary] = useState<null | ILibrary>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [defaultDate, setDefaultDate] = useState<null | string>(null);
  const { register, handleSubmit, reset } = useForm<ILibrary>({
    values: {
      ...library,
      added_date: defaultDate,
    } as ILibrary,
  });

  const getLibrary = async () => {
    try {
      const res = await a.get<ILibrary>(`/library/?id=${libraryId}`);
      const resData = res.data;
      setDefaultDate(unixToUSATime(resData.added_date));
      setLibrary(resData);
    } catch (e) {
      console.error(e);
    }
  };

  const onCancel = async () => {
    await reset();
    getLibrary();
    getLibrariesAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<ILibrary> = async (data) => {
    let resData: null | ILibrary = null;

    if (
      Number.isNaN(Number(data.product)) &&
      Number.isNaN(Number(data.consumer))
    ) {
      toaster.create({
        description: 'Библиотека не обновлена',
        type: 'error',
      });
      return;
    }

    try {
      let res = await a.put<ILibrary>(`/library/?id=${data.id}`, {
        product: Number(data.product),
        consumer: Number(data.consumer),
        added_date: USADateToUnix(String(data.added_date)),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Бибилотека успешно обновлена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Библиотека не обновлена',
        type: 'error',
      });
    }
    onCancel();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'added_date')
      return (
        <Input
          type="date"
          {...register(field as TLibrary)}
          {...{
            variant: 'subtle',
            disabled: !isEdited,
            css: { width: 250 },
          }}
        />
      );
    return (
      <Input
        {...register(field as TLibrary)}
        {...{
          variant: 'subtle',
          disabled: !isEdited || field === 'id',
          css: { width: 250 },
        }}
      />
    );
  };

  useEffect(() => {
    getLibrary();
  }, [libraryId]);

  if (library)
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ padding: '20px', display: 'flex', gap: '80px' }}
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
              <Text>{field.lab}</Text>
              {renderFieldEntrail(field.val)}
            </Flex>
          ))}
          <Flex
            mt={5}
            direction={'column'}
            alignItems={'flex-end'}
            justifyContent={'space-between'}
          >
            {isEdited ? (
              <Flex w={'100%'} justifyContent={'space-between'}>
                <Button onClick={onCancel} css={{ width: 200 }}>
                  Отмена
                </Button>
                <Button type="submit" css={{ width: 200 }}>
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
                  1
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </form>
    );
  return null;
};
