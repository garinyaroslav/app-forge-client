import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { ILibrary, TLibrary } from '../types/library';
import { USADateToUnix } from '../../utils/USADateToUnix';

interface AddLibraryFormProps {
  getLibrariesAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор игры', val: 'gameId' },
  { lab: 'Идентификатор пользователя', val: 'consumerId' },
  { lab: 'Дата добавления', val: 'addedDate' },
];

export const AddLibraryForm: FC<AddLibraryFormProps> = ({
  getLibrariesAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<ILibrary>();

  const onSubmit: SubmitHandler<ILibrary> = async (data) => {
    let res;

    if (
      !Number.isNaN(Number(data.gameId)) &&
      !Number.isNaN(Number(data.consumerId))
    ) {
      res = await window.api.addLibrary({
        gameId: Number(data.gameId),
        consumerId: Number(data.consumerId),
        addedDate: USADateToUnix(String(data.addedDate)),
      });
    } else {
      res = null;
    }

    if (res) {
      toaster.create({
        description: 'Библиотека успешно добалена',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Библиотека не добавлена',
        type: 'error',
      });
    }

    reset();
    getLibrariesAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'addedDate')
      return (
        <Input
          type="date"
          {...register(field as TLibrary)}
          {...{
            variant: 'subtle',
            css: { width: 250 },
          }}
        />
      );
    return (
      <Input
        {...register(field as TLibrary, { required: true })}
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
