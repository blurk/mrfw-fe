import {
  ActionIcon,
  Anchor,
  Button,
  Group,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { uploadedMangaByUser } from "services/fetchers";
import client from "services/initPocketBase";
import useSWR, { mutate } from "swr";
import { MangaList, MangaRaw } from "types";

import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconList, IconTrash } from "@tabler/icons";
import {
  CellContext,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import BaseTable from "components/atoms/BaseTable";
import MangaStatusBadge from "components/atoms/MangaStatusBadge";
import Link from "next/link";
import Router from "next/router";
import toast from "react-hot-toast";
import { formatDate, MangaStatusText } from "utils";
import { useFormState, UseFormStateReturn } from "utils/hooks/useFormState";
import { DeleteModal } from "components/molecules/DeleteModal";
import ModalTitleWithAccent from "components/atoms/ModalTitleWithAccent";

type Props = {
  showDrawer: () => void;
};

const columnHelper = createColumnHelper<MangaRaw>();

const columns = [
  columnHelper.accessor("title", {
    header: "Tên truyện",
    cell: (info) => (
      <Link href={`/manga/${info.row.original.id}`}>
        <Anchor>{info.getValue()}</Anchor>
      </Link>
    ),
  }),
  columnHelper.accessor("@expand.author", {
    header: "Tác giả",
    cell: (info) =>
      info
        .getValue()
        .map((author) => author.name)
        .join(","),
  }),
  columnHelper.accessor("status", {
    header: "Trạng thái",
    cell: (info) => (
      <MangaStatusBadge
        type={info.getValue() as keyof typeof MangaStatusText}
      />
    ),
  }),
  columnHelper.accessor("chapters", {
    header: "Số chương",
    cell: (info) => <Text align="center">{info.getValue().length}</Text>,
  }),
  columnHelper.accessor("created", {
    header: "Ngày đăng",
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor("updated", {
    header: "Ngày cập nhật",
    cell: (info) => formatDate(info.getValue()),
  }),
];

const UploadedMangaTable = ({ showDrawer }: Props) => {
  const { data } = useSWR<MangaList>("uploaded-manga", uploadedMangaByUser, {
    isPaused: () => client.authStore.model == null,
  });

  const { updateEditData } = useFormState() as UseFormStateReturn<MangaRaw>;

  const [currentManga, setCurrentManga] = useState<MangaRaw | null>(null);

  const onEdit = useCallback(
    (row: MangaRaw) => {
      updateEditData(row);
      showDrawer();
    },
    [showDrawer, updateEditData]
  );

  const onChapterManagement = (row: MangaRaw) => {
    Router.push("/admin/" + row.id, undefined, {
      shallow: false,
    });
  };

  const [isDeleteModalOpen, deleteModalHandlers] = useDisclosure(false);

  const onDelete = useCallback(
    (row: MangaRaw) => {
      setCurrentManga(row);
      deleteModalHandlers.open();
    },
    [deleteModalHandlers]
  );

  const columnsWithActions = useMemo(() => {
    return [
      ...columns,
      {
        id: "action",
        header: "Thao tác",
        cell: ({ row }: CellContext<MangaRaw, any>) => {
          return (
            <Group noWrap>
              <Tooltip label="Chỉnh sửa truyện">
                <ActionIcon
                  color="green"
                  onClick={onEdit.bind(null, row.original)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Quản lý chương">
                <ActionIcon
                  color="blue"
                  onClick={onChapterManagement.bind(null, row.original)}
                >
                  <IconList size={18} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="Xóa truyện">
                <ActionIcon
                  color="red"
                  onClick={onDelete.bind(null, row.original)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          );
        },
      },
    ];
  }, [onDelete, onEdit]);

  const table = useReactTable({
    data: data?.items ?? [],
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
  });

  const onDeleteConfirm = async () => {
    if (currentManga) {
      await toast.promise(client.records.delete("mangas", currentManga.id), {
        loading: "Đang xóa truyện...",
        success: "Xóa truyện thành công",
        error: "Xóa truyện thất bại",
      });
      mutate("uploaded-manga");
    }

    deleteModalHandlers.close();
  };

  return (
    <>
      <DeleteModal
        isShow={isDeleteModalOpen}
        onClose={deleteModalHandlers.close}
        onConfirm={onDeleteConfirm}
        title={
          <ModalTitleWithAccent
            before="Bạn có muốn xóa truyện"
            value={currentManga?.title}
            after="không?"
          />
        }
      />

      <BaseTable table={table} />
    </>
  );
};

export default UploadedMangaTable;
