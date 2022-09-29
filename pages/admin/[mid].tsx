import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Group,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowBack, IconEdit, IconTrash, IconUpload } from "@tabler/icons";
import {
  CellContext,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import BaseTable from "components/atoms/BaseTable";
import ModalTitleWithAccent from "components/atoms/ModalTitleWithAccent";
import { DeleteModal } from "components/molecules/DeleteModal";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import { getChaptersOfManga } from "services/fetchers";
import client from "services/initPocketBase";
import useSWR from "swr";
import { Chapter } from "types";
import { formatDate } from "utils";

type Props = {
  mid: string;
};

const columnHelper = createColumnHelper<Chapter>();

const columns = [
  columnHelper.accessor("name", {
    header: "Tên chương",
    cell: (info) => (
      <Link href={`/manga/c/${info.row.original.id}`}>
        <Anchor>{info.getValue()}</Anchor>
      </Link>
    ),
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

const PageMid = ({ mid }: Props) => {
  const { data } = useSWR(mid, getChaptersOfManga, {
    isPaused: () => client.authStore.model == null,
  });

  const [isDeleteModalShow, deleteModalHandlers] = useDisclosure(false);

  const onEdit = () => {};

  const onDelete = () => {
    deleteModalHandlers.open();
  };

  const columnsWithActions = useMemo(() => {
    return [
      ...columns,
      {
        id: "action",
        header: "Thao tác",
        cell: ({ row }: CellContext<Chapter, any>) => {
          return (
            <Group noWrap>
              <Tooltip label="Chỉnh sửa chương">
                <ActionIcon
                  color="green"
                  onClick={onEdit.bind(null, row.original)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa chương">
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
  }, []);

  const table = useReactTable({
    data: data?.items ?? [],
    columns: columnsWithActions,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Head>
        <title>Quản lý chương</title>
      </Head>

      <DeleteModal
        isShow={isDeleteModalShow}
        onClose={deleteModalHandlers.close}
        // TODO: Update onConfirm logic
        onConfirm={deleteModalHandlers.close}
        title={
          <ModalTitleWithAccent
            before="Bạn có chắc là muốn xoá chương"
            value={"này"}
            after="không?"
          />
        }
      />

      <Link href="/admin">
        <Button variant="subtle" leftIcon={<IconArrowBack />}>
          Quay lại trang quản lý truyện
        </Button>
      </Link>

      <Title order={1} mt="md" color="gray.8">
        Quản lý chương
      </Title>

      <Box mt="md">
        <Group position="apart">
          <Title order={2} color="gray.7">
            Danh sách chương đã đăng
          </Title>

          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            leftIcon={<IconUpload size={18} />}
            onClick={undefined}
          >
            Thêm chương mới
          </Button>
        </Group>

        <Box mt="lg" p="sm" sx={{ backgroundColor: "white" }}>
          <BaseTable table={table} />
        </Box>
      </Box>
    </>
  );
};

export default PageMid;

export const getServerSideProps = ({ query }: GetServerSidePropsContext) => {
  return {
    props: {
      mid: query.mid,
    },
  };
};
