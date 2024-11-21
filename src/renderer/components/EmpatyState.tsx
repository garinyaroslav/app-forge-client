import { Center } from '@chakra-ui/react';
import { EmptyState as ChakraEmptyState } from './ui/empty-state';
import CrossSvg from '../assets/cross.svg';

const Icon = () => <img src={CrossSvg} alt={'cross'} />;

export const EmptyState = () => {
  return (
    <Center css={{ width: '100%', height: '100%' }}>
      <ChakraEmptyState
        {...{
          icon: <Icon />,
          title: 'Ничего не выбрано',
          description: 'Выберите элемент из списка',
        }}
      />
    </Center>
  );
};
