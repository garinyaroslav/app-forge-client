import { Button, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { PasswordInput } from './ui/password-input';
import { ILoginForm, ILoginRes } from '../types/auth';
import { Field } from './ui/field';
import a from '../axios';

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
    try {
      const res = await a.post<ILoginForm>('/token/', data);
      const resData = res.data as unknown as ILoginRes;

      localStorage.setItem('accessToken', resData.access);
      localStorage.setItem('refreshToken', resData.refresh);

      if (resData.is_staff) {
        localStorage.setItem('uid', String(resData.userId));
        nav('/admin/games');
      } else if (!resData.is_staff) {
        localStorage.setItem('uid', String(resData.userId));
        nav('/user/shop');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('username', { type: 'value' });
      resetField('password');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
    >
      <Field
        invalid={Boolean(errors.username)}
        errorText={
          errors.username?.type === 'required'
            ? 'Поле обезательно к заполнению'
            : 'Неправильное имя пользователя или пароль'
        }
      >
        <Input
          {...register('username', { required: 'Введите имя пользователя' })}
          variant={'subtle'}
          w={300}
          className="peer"
          placeholder="Имя пользователя"
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
          placeholder="Пароль"
        />
      </Field>
      <Button type="submit">Войти</Button>
    </form>
  );
};
