import { Button, Group, Modal, Text, Title } from "@mantine/core";
import React from "react";

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
  onModalConfirm: () => void;
};

const DiscardModal = ({ isModalOpen, onClose, onModalConfirm }: Props) => {
  return (
    <Modal
      size="sm"
      centered
      title={
        <Title order={3} color="dark.7">
          Có thay đổi chưa được lưu
        </Title>
      }
      withCloseButton={false}
      opened={isModalOpen}
      onClose={onClose}
    >
      <Text size="md">Bạn có chắc là muốn thoát không?</Text>
      <Group mt="md" position="right">
        <Button variant="subtle" color="dark" onClick={onClose}>
          Không
        </Button>
        <Button color="red" onClick={onModalConfirm}>
          Có
        </Button>
      </Group>
    </Modal>
  );
};

export default DiscardModal;
