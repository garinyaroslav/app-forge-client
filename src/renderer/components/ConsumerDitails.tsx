import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { toaster } from './ui/toaster';
import { IConsumer, TConsumer } from '../types/consumer';
import { unixToUSATime } from '../../utils/unixToUSADate';
import { USADateToUnix } from '../../utils/USADateToUnix';
import a from '../../renderer/axios';

interface ConsumerDitailsProps {
  consumerId: number;
  getConsumersAndWriteToState: () => void;
}

const fields = [
  { lab: 'Идентификатор пользователя', val: 'id' },
  { lab: 'Логин', val: 'username' },
  { lab: 'Электронная почта', val: 'email' },
  { lab: 'Имя', val: 'first_name' },
  { lab: 'Фамилия', val: 'last_name' },
  { lab: 'Дата регистрации', val: 'date_joined' },
  { lab: 'Админ', val: 'is_staff' },
];

export const ConsumerDitails: FC<ConsumerDitailsProps> = ({
  consumerId,
  getConsumersAndWriteToState,
}) => {
  const [consumer, setConsumer] = useState<null | IConsumer>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [defaultDate, setDefaultDate] = useState<null | string>(null);
  const { register, handleSubmit, reset } = useForm<IConsumer>({
    values: {
      ...consumer,
      date_joined: defaultDate,
    } as IConsumer,
  });

  const getConsumer = async () => {
    try {
      const res = await a.get<IConsumer>(`/consumer/?id=${consumerId}`);
      const resData = res.data;
      setDefaultDate(unixToUSATime(resData.date_joined));
      setConsumer(resData);
    } catch (e) {
      console.error(e);
    }
  };

  const onCancel = async () => {
    await reset();
    getConsumer();
    getConsumersAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IConsumer> = async (data) => {
    let resData: null | IConsumer = null;

    try {
      let res = await a.put<IConsumer>(`/consumer/?id=${data.id}`, {
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        is_staff: Boolean(data.is_staff),
        date_joined: USADateToUnix(String(data.date_joined)),
      });

      resData = res.data;
    } catch (e) {
      console.error(e);
    }

    if (resData) {
      toaster.create({
        description: 'Пользователь успешно обновлён',
        type: 'success',
      });
    } else {
      toaster.create({
        description: 'Пользователь не был обновлён',
        type: 'error',
      });
    }
    onCancel();
  };

  const renderFieldEntrail = (field: string) => {
    if (field === 'is_staff') {
      return (
        <Flex css={{ width: 250 }}>
          <input
            disabled={!isEdited}
            type="checkbox"
            {...register(field as TConsumer)}
          />
        </Flex>
      );
    }
    if (field === 'date_joined')
      return (
        <Input
          type="date"
          {...register(field as TConsumer)}
          {...{
            variant: 'subtle',
            disabled: !isEdited,
            css: { width: 250 },
          }}
        />
      );
    return (
      <Input
        {...register(field as TConsumer)}
        {...{
          variant: 'subtle',
          disabled: !isEdited || field === 'id',
          css: { width: 250 },
        }}
      />
    );
  };

  useEffect(() => {
    getConsumer();
  }, [consumerId]);

  if (consumer)
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
