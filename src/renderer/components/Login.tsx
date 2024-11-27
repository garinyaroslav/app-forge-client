import { Button, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { PasswordInput } from './ui/password-input';
import { ILoginForm } from '../types/auth';
import { Field } from './ui/field';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const onSubmit = async (data: ILoginForm) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
    >
      <Field
        invalid={Boolean(errors.login)}
        errorText="Введите имя пользователя"
      >
        <Input
          {...register('login', { required: true })}
          variant={'subtle'}
          w={300}
          className="peer"
          placeholder="E-mail"
        />
      </Field>
      <Field
        mb={6}
        invalid={Boolean(errors.password)}
        errorText="Введите пользователя"
      >
        <PasswordInput
          {...register('password', { required: true })}
          variant={'subtle'}
          w={300}
          className="peer"
          placeholder="Password"
        />
      </Field>
      <Button type="submit">Войти</Button>
    </form>
  );
};
