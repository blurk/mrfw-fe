import { ActionIcon, Anchor, Group, Text, Tooltip } from '@mantine/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { uploadedMangaByUser } from 'services/fetchers';
import client from 'services/initPocketBase';
import useSWR, { useSWRConfig } from 'swr';
import { Author, Manga, MangaList } from 'domains';

import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle, IconCheck, IconEdit, IconList, IconTrash } from '@tabler/icons';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BaseTable from 'components/atoms/BaseTable';
import MangaStatusBadge from 'components/atoms/MangaStatusBadge';
import Link from 'next/link';
import Router from 'next/router';
import { COLLECTION, formatDate, MangaStatusText } from 'utils';
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState';
import { DeleteModal } from 'components/molecules/DeleteModal';
import ModalTitleWithAccent from 'components/atoms/ModalTitleWithAccent';
import { Routes } from 'utils/routes';
import { showNotification, updateNotification } from '@mantine/notifications';

type Props = {
  showDrawer: () => void;
};

const columnHelper = createColumnHelper<Manga>();

const columns = [
  columnHelper.accessor('title', {
    header: 'Tên truyện',
    cell: (info) => (
      <Anchor component={Link} href={Routes.MANGA + info.row.original.id}>
        {info.getValue()}
      </Anchor>
    ),
  }),
  columnHelper.accessor('expand.author', {
    header: 'Tác giả',
    cell: (info) =>
      info
        .getValue()
        .map((author: Author) => author.name)
        .join(','),
  }),
  columnHelper.accessor('status', {
    header: 'Trạng thái',
    cell: (info) => <MangaStatusBadge type={info.getValue() as keyof typeof MangaStatusText} />,
  }),
  columnHelper.accessor('chapters', {
    header: 'Số chương',
    cell: (info) => <Text align="center">{info.getValue().length}</Text>,
  }),
  columnHelper.accessor('created', {
    header: 'Ngày đăng',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('updated', {
    header: 'Ngày cập nhật',
    cell: (info) => formatDate(info.getValue()),
  }),
];

const UploadedMangaTable = ({ showDrawer }: Props) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useSWR<MangaList>('uploaded-manga', () => uploadedMangaByUser(pageIndex + 1, pageSize), {
    isPaused: () => client.authStore.model == null,
    suspense: true,
  });

  const { mutate } = useSWRConfig();

  // Manually revalidate when pagination options change
  useEffect(() => {
    mutate('uploaded-manga');
  }, [mutate, pageIndex, pageSize]);

  const { updateEditData } = useFormState() as UseFormStateReturn<Manga>;

  const [currentManga, setCurrentManga] = useState<Manga | null>(null);

  const onEdit = useCallback(
    (row: Manga) => {
      updateEditData(row);
      showDrawer();
    },
    [showDrawer, updateEditData]
  );

  const onChapterManagement = (row: Manga) => {
    Router.push(Routes.MANAGE + row.id);
  };

  const [isDeleteModalOpen, deleteModalHandlers] = useDisclosure(false);

  const onDelete = useCallback(
    (row: Manga) => {
      setCurrentManga(row);
      deleteModalHandlers.open();
    },
    [deleteModalHandlers]
  );

  const columnsWithActions = useMemo(() => {
    return [
      ...columns,
      {
        id: 'action',
        header: 'Thao tác',
        cell: ({ row }: CellContext<Manga, any>) => {
          return (
            <Group noWrap>
              <Tooltip label="Chỉnh sửa truyện">
                <ActionIcon color="green" onClick={onEdit.bind(null, row.original)}>
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Quản lý chương">
                <ActionIcon color="blue" onClick={onChapterManagement.bind(null, row.original)}>
                  <IconList size={18} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Xóa truyện">
                <ActionIcon color="red" onClick={onDelete.bind(null, row.original)}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          );
        },
      },
    ];
  }, [onDelete, onEdit]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    pageCount: data ? Math.ceil(data.totalItems / data.perPage) : -1, // page count
    manualPagination: true,
  });

  const onDeleteConfirm = async () => {
    if (currentManga) {
      try {
        showNotification({
          id: 'delete-manga',
          loading: true,
          title: 'Đang xóa truyện...',
          message: 'Truyện của bạn đang được xóa, hãy chờ chút nhé',
          autoClose: false,
          disallowClose: true,
        });
        await client.collection(COLLECTION.MANGAS).delete(currentManga.id);
        mutate('uploaded-manga');
        updateNotification({
          id: 'delete-manga',
          title: 'Thao tác thành công',
          message: 'Truyện của bạn đã được xóa thành công',
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      } catch (error) {
        console.log(error);
        updateNotification({
          id: 'delete-manga',
          title: 'Thao tác thất bại',
          message: 'Truyện của bạn đã không được xóa. Hãy thử lại nhé',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
        });
      }
    }

    deleteModalHandlers.close();
  };

  return (
    <>
      <DeleteModal
        isShow={isDeleteModalOpen}
        onClose={deleteModalHandlers.close}
        onConfirm={onDeleteConfirm}
        title={<ModalTitleWithAccent before="Bạn có muốn xóa truyện" value={currentManga?.title} after="không?" />}
      />

      <BaseTable table={table} hasPagination />
    </>
  );
};

export default UploadedMangaTable;
