import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { excludedFields } from '../../utils/excludedFields';
import { toaster } from './ui/toaster';
import { ILibrary, TLibrary } from '../types/library';
import { unixToUSATime } from '../../utils/unixToUSADate';
import { USADateToUnix } from '../../utils/USADateToUnix';

interface LibraryDitailsProps {
  libraryId: number;
  getLibrariesAndWriteToState: () => void;
}

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
      addedDate: defaultDate as unknown as number,
    } as ILibrary,
  });

  const getLibrary = async () => {
    const data = await window.api.getLibrary(libraryId).catch(console.error);

    setDefaultDate(unixToUSATime(data[0].addedDate));
    setLibrary(data[0]);
  };

  const onCancel = async () => {
    await reset();
    getLibrary();
    getLibrariesAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<ILibrary> = async (data) => {
    const res = await window.api.updateLibrary({
      id: Number(data.id),
      gameId: Number(data.gameId),
      consumerId: Number(data.consumerId),
      addedDate: USADateToUnix(String(data.addedDate)),
    });

    if (res) {
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
    if (field === 'addedDate')
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
          {Object.keys(library)
            .filter((fieldName) => !excludedFields.includes(fieldName))
            .map((field) => (
              <Flex
                key={field}
                alignItems={'center'}
                justifyContent={'space-between'}
                css={{ width: 450 }}
              >
                <Text>{field}</Text>
                {renderFieldEntrail(field)}
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
