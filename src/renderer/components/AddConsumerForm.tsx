import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { IConsumer, TConsumer } from '../types/consumer';
import { USADateToUnix } from '../utils/USADateToUnix';

interface AddConsumerFormProps {
  getConsumersAndWriteToState: () => void;
}

const fields = [
  'username',
  'email',
  'passwordHash',
  'firstName',
  'lastName',
  'regDate',
  'isAdmin',
];

export const AddConsumerForm: FC<AddConsumerFormProps> = ({
  getConsumersAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<IConsumer>();

  const onSubmit: SubmitHandler<IConsumer> = async (data) => {
    const res = await window.api.addConsumer({
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      regDate: USADateToUnix(String(data.regDate)),
      isAdmin: Boolean(data.isAdmin),
    });

    if (res) {
      toaster.create({
        description: 'Пользователь успешно добавлен',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Пользователь не добавлен',
        type: 'error',
      });
    }

    reset();
    getConsumersAndWriteToState();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'isAdmin') {
      return (
        <Flex css={{ width: 250 }}>
          <input type="checkbox" {...register(field as TConsumer)} />
        </Flex>
      );
    }
    if (field === 'regDate')
      return (
        <Input
          {...register(field as TConsumer)}
          {...{
            type: 'date',
            variant: 'subtle',
            css: { width: 250 },
          }}
        />
      );
    return (
      <Input
        {...register(field as TConsumer, { required: true })}
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
        key={field}
        alignItems={'center'}
        justifyContent={'space-between'}
        css={{ width: 450 }}
      >
        <Text>{field}</Text>
        {renderFieldEntrail(field)}
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
