import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { DataListItem, DataListRoot } from '../components/ui/data-list';

import AvatarSvg from '../assets/avatar.svg';
import { IProfile } from '../types/consumer';
import { validateEmail } from '../../utils/validateEmail';
import { toaster, Toaster } from '../components/ui/toaster';

export const Profile = () => {
  const uid = localStorage.getItem('uid');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [regDate, setRegDate] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const getProfile = async () => {
    const res = (await window.api
      .getProfile(uid)
      .catch(console.error)) as IProfile[];

    setFirstName(res[0].firstName);
    setLastName(res[0].lastName);
    setEmail(res[0].email);
    setRegDate(new Date(res[0].regDate * 1000).toLocaleDateString());
  };

  useEffect(() => {
    getProfile();
  }, []);

  const updateProfile = async () => {
    if (firstName.length > 0 && lastName.length > 0 && validateEmail(email)) {
      const res = await window.api
        .updateProfile({ id: uid, firstName, lastName, email })
        .catch(console.error);

      if (res) {
        toaster.create({
          description: 'Профиль успешно обновлён',
          type: 'success',
        });
      } else {
        toaster.create({
          description: 'Профиль не обновлён',
          type: 'error',
        });
      }
    } else {
      toaster.create({
        description: 'Данные введены некорректно',
        type: 'error',
      });
    }

    getProfile();
    setIsEdit(false);
  };

  return (
    <Flex>
      <Toaster />
      <Flex
        css={{
          width: 800,
          m: '20px auto',
          background: '#111b21',
          borderRadius: 4,
          p: 5,
        }}
      >
        <Image css={{ h: 60 }} src={AvatarSvg} alt="avatar" />
        <Flex flexDirection={'column'} alignItems={'center'} flex="1">
          <Heading css={{ mb: 8 }}>Профиль</Heading>
          <DataListRoot orientation={'horizontal'}>
            <DataListItem
              css={{ mb: 3, h: '40px' }}
              label={'Имя'}
              value={
                isEdit ? (
                  <Input
                    variant={'subtle'}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                ) : (
                  <Text css={{ w: '185px' }}>{firstName}</Text>
                )
              }
            />
            <DataListItem
              css={{ mb: 3, h: '40px' }}
              label={'Фамилия'}
              value={
                isEdit ? (
                  <Input
                    variant={'subtle'}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                ) : (
                  <Text css={{ w: '185px' }}>{lastName}</Text>
                )
              }
            />
            <DataListItem
              css={{ mb: 3, h: '40px' }}
              label={'Почта'}
              value={
                isEdit ? (
                  <Input
                    variant={'subtle'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <Text css={{ w: '185px' }}>{email}</Text>
                )
              }
            />
            <DataListItem
              css={{ mb: 3 }}
              label={'Дата регистрации'}
              value={regDate}
            />
          </DataListRoot>
          <Box css={{ w: '100%', mt: 8, mb: 8 }}>
            <Button
              onClick={isEdit ? () => updateProfile() : () => setIsEdit(true)}
              css={{ ml: '120px' }}
            >
              {isEdit ? 'Сохранить' : 'Редактировать'}
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
