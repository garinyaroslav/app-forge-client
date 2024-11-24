import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Flex, Input, Text, Heading, Button } from '@chakra-ui/react';
import { excludedFields } from '../utils/excludedFields';
import { toaster } from './ui/toaster';
import { IConsumer, TConsumer } from '../types/consumer';
import { unixToUSATime } from '../utils/unixToUSADate';
import { USADateToUnix } from '../utils/USADateToUnix';

interface ConsumerDitailsProps {
  consumerId: number;
  getConsumersAndWriteToState: () => void;
}

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
      regDate: defaultDate,
    } as IConsumer,
  });

  const getConsumer = async () => {
    const data = await window.api.getConsumer(consumerId).catch(console.error);

    setDefaultDate(unixToUSATime(data[0].regDate));
    setConsumer(data[0]);
  };

  const onCancel = async () => {
    await reset();
    getConsumer();
    getConsumersAndWriteToState();
    setIsEdited(false);
  };

  const onSubmit: SubmitHandler<IConsumer> = async (data) => {
    const res = await window.api.updateConsumer({
      id: Number(data.id),
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      regDate: USADateToUnix(data.regDate),
    });

    if (res) {
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
    if (field === 'regDate')
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
          {Object.keys(consumer)
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
