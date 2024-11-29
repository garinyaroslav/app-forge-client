import { Button, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { PasswordInput } from './ui/password-input';
import { ILoginForm, LoginRes } from '../types/auth';
import { Field } from './ui/field';

export const Login = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm<ILoginForm>();

  const onSubmit = async (data: ILoginForm) => {
    const res = (await window.api.login(data)) as {
      status: LoginRes;
      uid: number | null;
    };

    switch (res.status) {
      case LoginRes.user:
        localStorage.setItem('uid', String(res.uid));
        nav('/user');
        break;
      case LoginRes.admin:
        localStorage.setItem('uid', String(res.uid));
        nav('/admin/games');
        break;
      case LoginRes.notFound:
        setError('login', { type: 'value' });
        resetField('password');
        break;
      default:
        break;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
    >
      <Field
        invalid={Boolean(errors.login)}
        errorText={
          errors.login?.type === 'required'
            ? 'Поле обезательно к заполнению'
            : 'Неправильное имя пользователя или пароль'
        }
      >
        <Input
          {...register('login', { required: 'Введите имя пользователя' })}
          variant={'subtle'}
          w={300}
          className="peer"
          placeholder="Login"
        />
      </Field>
      <Field
        mb={6}
        invalid={Boolean(errors.password)}
        errorText={'Поле обезательно к заполнению'}
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
