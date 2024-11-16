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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить элемент</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p>Вы уверены что хотите удалить этот элемент?</p>
            </DialogBody>
            <DialogFooter>
              <Button onClick={onClose} variant="outline">
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
