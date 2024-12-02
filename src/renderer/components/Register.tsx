import { Button, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { PasswordInput } from './ui/password-input';
import { IRegisterForm } from '../types/auth';
import { Field } from './ui/field';

export const Register = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterForm>();

  const onSubmit = async (data: IRegisterForm) => {
    const res = await window.api.register(data);
    await localStorage.setItem('uid', String(res));
    nav('/user/shop');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
    >
      <Field
        invalid={Boolean(errors.fname)}
        errorText={'Поле обезательно к заполнению'}
      >
        <Input
          {...register('fname', { required: true })}
          variant={'subtle'}
          w={300}
          placeholder="Имя"
        />
      </Field>
      <Field
        invalid={Boolean(errors.lname)}
        errorText={'Поле обезательно к заполнению'}
      >
        <Input
          {...register('lname', { required: true })}
          variant={'subtle'}
          w={300}
          placeholder="Фамилия"
        />
      </Field>
      <Field
        invalid={Boolean(errors.login)}
        errorText={'Поле обезательно к заполнению'}
      >
        <Input
          {...register('login', { required: true })}
          variant={'subtle'}
          w={300}
          placeholder="Имя пользователя"
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
        />
      </Field>
      <Button type="submit">Зарегистрироваться</Button>
    </form>
  );
};
