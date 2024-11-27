import { Box, Button, FieldRoot, Flex, Input } from '@chakra-ui/react';
import { PasswordInput } from './ui/password-input';

export const Login = () => {
  return (
    <Flex gap={8} direction={'column'} justifyContent={'center'}>
      <FieldRoot>
        <Box pos="relative" w="full">
          <Input
            variant={'subtle'}
            w={300}
            className="peer"
            placeholder="E-mail"
          />
        </Box>
      </FieldRoot>
      <FieldRoot mb={6}>
        <PasswordInput
          variant={'subtle'}
          w={300}
          className="peer"
          placeholder="Password"
        />
      </FieldRoot>
      <Button>Войти</Button>
    </Flex>
  );
};
