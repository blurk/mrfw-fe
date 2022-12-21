import { ActionIcon, Anchor, Group, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons';
import { CellContext, createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BaseTable from 'components/atoms/BaseTable';
import ModalTitleWithAccent from 'components/atoms/ModalTitleWithAccent';
import { DeleteModal } from 'components/molecules/DeleteModal';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getChaptersOfManga } from 'services/fetchers';
import client from 'services/initPocketBase';
import useSWR, { useSWRConfig } from 'swr';
import { Chapter } from 'types';
import { formatDate } from 'utils';
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState';
import { Routes } from 'utils/routes';

type Props = {
  mid: string;
  showDrawer: () => void;
};

const columnHelper = createColumnHelper<Chapter>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Tên chương',
    cell: (info) => (
      <Anchor component={Link} href={Routes.MANGA_CHAPTER + info.row.original.id}>
        {info.getValue()}
      </Anchor>
    ),
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

const ManageChaptersTable = ({ mid, showDrawer }: Props) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useSWR('chapters-table', () => getChaptersOfManga(mid, pageIndex + 1, pageSize), {
    isPaused: () => client.authStore.model == null,
    suspense: true,
  });

  const { editData, updateEditData } = useFormState() as UseFormStateReturn<Chapter>;

  const [isDeleteModalShow, deleteModalHandlers] = useDisclosure(false);

  const onEdit = useCallback(
    (row: Chapter) => {
      showDrawer();
      updateEditData(row);
    },
    [showDrawer, updateEditData]
  );

  const onDelete = useCallback(
    (row: Chapter) => {
      updateEditData(row);
      deleteModalHandlers.open();
    },
    [deleteModalHandlers, updateEditData]
  );

  const { mutate } = useSWRConfig();

  // Manually revalidate when pagination options change
  useEffect(() => {
    mutate('chapters-table');
  }, [mutate, pageIndex, pageSize]);

  const onDeleteConfirm = async () => {
    try {
      if (editData?.id) {
        await toast.promise(client.records.delete('chapter', editData?.id), {
          loading: 'Đang xóa chương...',
          success: 'Xóa chương thành công',
          error: 'Xóa chương thất bại',
        });

        updateEditData(null);
      }

      mutate('chapters-table');
    } catch (error) {
      console.log(error);
    }

    deleteModalHandlers.close();
  };

  const columnsWithActions = useMemo(() => {
    return [
      ...columns,
      {
        id: 'action',
        header: 'Thao tác',
        cell: ({ row }: CellContext<Chapter, any>) => {
          return (
            <Group noWrap>
              <Tooltip label="Chỉnh sửa chương">
                <ActionIcon color="green" onClick={onEdit.bind(null, row.original)}>
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa chương">
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

  return (
    <>
      <DeleteModal
        isShow={isDeleteModalShow}
        onClose={deleteModalHandlers.close}
        onConfirm={onDeleteConfirm}
        title={<ModalTitleWithAccent before="Bạn có chắc là muốn xoá chương" value={editData?.name} after="không?" />}
      />

      <BaseTable table={table} hasPagination />
    </>
  );
};

export default ManageChaptersTable;
