import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster';
import { IConsumer, TConsumer } from '../types/consumer';
import { USADateToUnix } from '../../utils/USADateToUnix';
import a from '../../renderer/axios';

interface AddConsumerFormProps {
  getConsumersAndWriteToState: () => void;
}

const fields = [
  { lab: 'Логин', val: 'username' },
  { lab: 'Электронная почта', val: 'email' },
  { lab: 'Пароль', val: 'password' },
  { lab: 'Имя', val: 'first_name' },
  { lab: 'Фамилия', val: 'last_name' },
  { lab: 'Дата регистрации', val: 'date_joined' },
  { lab: 'Админ', val: 'is_staff' },
];

export const AddConsumerForm: FC<AddConsumerFormProps> = ({
  getConsumersAndWriteToState,
}) => {
  const { register, handleSubmit, reset } = useForm<IConsumer>();

  const onSubmit: SubmitHandler<IConsumer> = async (data) => {
    let resData: null | IConsumer = null;

    try {
      let res = await a.post<IConsumer>(`/consumer/`, {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        date_joined: USADateToUnix(data.date_joined),
        is_staff: Boolean(data.is_staff),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
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
    if (field === 'is_staff') {
      return (
        <Flex css={{ width: 250 }}>
          <input
            type="checkbox"
            {...{
              style: {
                background: '#e5e7eb',
                color: '#111827',
                borderRadius: '4px',
                padding: 6,
              },
            }}
            {...register(field as TConsumer)}
          />
        </Flex>
      );
    }
    if (field === 'date_joined')
      return (
        <Input
          {...register(field as TConsumer)}
          {...{
            type: 'date',
            variant: 'subtle',
            css: { width: 250 },
            colorPalette: 'green',
            bg: '#e5e7eb',
            color: '#111827',
          }}
        />
      );
    return (
      <Input
        {...register(field as TConsumer, { required: true })}
        {...{
          variant: 'subtle',
          css: { width: 250 },
          colorPalette: 'green',
          bg: '#e5e7eb',
          color: '#111827',
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
        <Text color="#111827">{field.lab}</Text>
        {renderFieldEntrail(field.val)}
      </Flex>
    ));
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
        <Flex direction={'column'} gap={5}>
          <Heading css={{ mb: 5, color: '#111827' }}>Свойства</Heading>
          {renderFields()}
          <Button
            type="submit"
            bg="#e5e7eb"
            color="#111827"
            _hover={{ bg: '#d1d1d1' }}
            css={{ width: 200, ml: '250px', mt: 5 }}
          >
            Добавить
          </Button>
        </Flex>
      </form>
    </>
  );
};
