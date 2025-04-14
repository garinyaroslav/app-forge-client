import { Button, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { PasswordInput } from './ui/password-input';
import { ILoginRes, IRegisterForm } from '../types/auth';
import { Field } from './ui/field';
import EyeSvg from '../assets/eye.svg';
import EyeClosedSvg from '../assets/eyeClosed.svg';
import a from '../axios';

export const Register = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<IRegisterForm>();

  const onSubmit = async (data: IRegisterForm) => {
    let resData: null | ILoginRes = null;

    try {
      let res = await a.post<ILoginRes>(`/register/`, {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      });

      resData = res.data;
    } catch (e) {
      console.error('Registration error:', e);
      reset();
      setError('username', { type: 'exist' });
    }

    if (!resData) return;

    localStorage.setItem('uid', String(resData.userId));
    localStorage.setItem('accessToken', resData.access);
    localStorage.setItem('refreshToken', resData.refresh);
    localStorage.setItem('username', resData.username);
    nav('/user/shop');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
    >
      <Field
        invalid={Boolean(errors.first_name)}
        errorText={'Поле обезательно к заполнению'}
      >
        <Input
          {...register('first_name', { required: true })}
          variant={'subtle'}
          w={300}
          placeholder="Имя"
          bg="#e5e7eb"
          color="#111827"
          colorPalette="green"
        />
      </Field>
      <Field
        invalid={Boolean(errors.last_name)}
        errorText={'Поле обезательно к заполнению'}
      >
        <Input
          {...register('last_name', { required: true })}
          variant={'subtle'}
          w={300}
          placeholder="Фамилия"
          bg="#e5e7eb"
          color="#111827"
          colorPalette="green"
        />
      </Field>
      <Field
        invalid={Boolean(errors.username)}
        errorText={
          errors.username?.type === 'required'
            ? 'Поле обезательно к заполнению'
            : errors.username?.type === 'exist'
              ? 'Пользователь с таким логином уже существует'
              : ''
        }
      >
        <Input
          {...register('username', { required: true })}
          variant={'subtle'}
          w={300}
          placeholder="Имя пользователя"
          bg="#e5e7eb"
          color="#111827"
          colorPalette="green"
        />
      </Field>
      <Field
        invalid={Boolean(errors.email)}
        errorText={'Поле обезательно к заполнению'}
      >
        <Input
          type={'email'}
          {...register('email', {
            required: true,
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          variant={'subtle'}
          w={300}
          placeholder="E-mail"
          bg="#e5e7eb"
          color="#111827"
          colorPalette="green"
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
          placeholder="Пароль"
          colorPalette="green"
          bg="#e5e7eb"
          color="#111827"
          visibilityIcon={{
            off: <img style={{ width: '18px' }} src={EyeSvg} />,
            on: <img style={{ width: '18px' }} src={EyeClosedSvg} />,
          }}
        />
      </Field>
      <Button
        bg="#e5e7eb"
        color="#111827"
        _hover={{ bg: '#d1d1d1' }}
        type="submit"
      >
        Зарегистрироваться
      </Button>
    </form>
  );
};
