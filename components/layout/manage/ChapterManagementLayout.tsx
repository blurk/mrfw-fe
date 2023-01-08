import { Button, Title, Box, Group, Drawer, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowBack, IconPlus } from '@tabler/icons';
import WithSuspense from 'components/atoms/WithSuspense';
import FormChapter from 'components/form/FormChapter';
import { Chapter } from 'domains';
import Link from 'next/link';
import React from 'react';
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState';
import ManageChaptersTable from './ChapterTable';
import DiscardModal from './DiscardModal';

type Props = { mid: string };

const ChapterManagementLayout = ({ mid }: Props) => {
  const { editData, isDirty, reset } = useFormState() as UseFormStateReturn<Chapter>;

  const [isDrawerOpen, drawerHandlers] = useDisclosure(false);

  const [isModalOpen, modalHandlers] = useDisclosure(false);

  const handleDrawerClose = () => {
    if (isDirty) {
      modalHandlers.open();
    } else {
      drawerHandlers.close();
      reset();
    }
  };

  const handleDiscardModalConfirm = () => {
    modalHandlers.close();
    drawerHandlers.close();
    reset();
  };

  return (
    <>
      <Link href="/manage">
        <Button variant="subtle" leftIcon={<IconArrowBack />}>
          Quay lại trang quản lý truyện
        </Button>
      </Link>

      <Title order={1} mt="md" color="gray.8">
        Quản lý chương
      </Title>

      <Box mt="md" pb="30vh">
        <Group position="apart">
          <Title order={2} color="gray.7">
            Danh sách chương đã đăng
          </Title>

          <Button
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan' }}
            leftIcon={<IconPlus size={18} />}
            onClick={drawerHandlers.open}
          >
            Thêm chương mới
          </Button>
        </Group>

        <Box mt="lg" p="sm" sx={{ backgroundColor: 'white' }}>
          <WithSuspense>
            <ManageChaptersTable showDrawer={drawerHandlers.open} mid={mid} />
          </WithSuspense>
        </Box>
      </Box>

      {/* ADD DRAWER */}
      <Drawer
        title={editData ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
        padding="xl"
        size="50%"
        position="right"
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        {/* DISCARD MODAL */}
        <DiscardModal
          isModalOpen={isModalOpen}
          onClose={modalHandlers.close}
          onModalConfirm={handleDiscardModalConfirm}
        />

        {/* FORM */}
        <ScrollArea type="hover" style={{ height: '80vh', width: '100%' }}>
          <FormChapter hideDrawer={drawerHandlers.close} mid={mid} />
        </ScrollArea>
      </Drawer>
    </>
  );
};

export default ChapterManagementLayout;
