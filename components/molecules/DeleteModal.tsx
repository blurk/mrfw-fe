import { Button, Group, Modal } from "@mantine/core";
import React from "react";

type Props = {
  isShow: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string | JSX.Element;
};

export const DeleteModal = ({ isShow, title, onClose, onConfirm }: Props) => {
  return (
    <Modal
      centered
      opened={isShow}
      onClose={onClose}
      withCloseButton={false}
      title={title}
    >
      <Group position="right">
        <Button color="blue" onClick={onConfirm}>
          Có
        </Button>
        <Button color="red" onClick={onClose}>
          Không
        </Button>
      </Group>
    </Modal>
  );
};
