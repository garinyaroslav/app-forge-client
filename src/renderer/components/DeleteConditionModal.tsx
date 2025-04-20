import { FC } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
  Portal,
  DialogPositioner,
} from '@chakra-ui/react';
import { Button } from './ui/button';

interface DeleteConditionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const DeleteConditionModal: FC<DeleteConditionModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  return (
    <DialogRoot
      open={open}
      size={'xs'}
      onOpenChange={() => onClose()}
      placement={'center'}
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent {...{ bg: '#f8fafc' }}>
            <DialogHeader>
              <DialogTitle {...{ color: '#111827' }}>
                Удалить элемент
              </DialogTitle>
            </DialogHeader>
            <DialogBody {...{ color: '#111827' }}>
              <p>Вы уверены что хотите удалить этот элемент?</p>
            </DialogBody>
            <DialogFooter>
              <Button
                onClick={onClose}
                bg="#e5e7eb"
                color="#111827"
                _hover={{ bg: '#d1d1d1' }}
                variant="outline"
                css={{
                  border: 'none',
                }}
              >
                Отмена
              </Button>
              <Button onClick={onSubmit} colorPalette={'red'}>
                Удалить
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
};
