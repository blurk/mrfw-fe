import { Button, FileInput, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import FileInputPreview from 'components/atoms/FileInputPreview';
import { Record } from 'pocketbase';
import { useEffect, useState } from 'react';
import client from 'services/initPocketBase';
import { useSWRConfig } from 'swr';
import { Chapter, ChapterRequest } from 'domains';
import { chapterSchema, COLLECTION, transformToFormData } from 'utils';
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons';

type Props = {
  hideDrawer: () => void;
  mid: string;
};

const getInitialValues = (data?: Chapter | null) =>
  data
    ? {
        ...data,
        images: data.images.map((img) => `${process.env.NEXT_PUBLIC_FILES_URL}/chapter/${data.id}/${img}`),
      }
    : {
        ...chapterSchema.cast({}),
      };

const FormChapter = ({ hideDrawer, mid }: Props) => {
  const { mutate } = useSWRConfig();

  const { editData, changeDirtyStatus, reset: formStateReset } = useFormState() as UseFormStateReturn<Chapter>;

  const { onSubmit, getInputProps, isDirty, reset, values } = useForm<ChapterRequest>({
    validate: yupResolver(chapterSchema),
    initialValues: getInitialValues(editData),
  });

  const _isFormDirty = isDirty();

  useEffect(() => {
    changeDirtyStatus(_isFormDirty);
  }, [changeDirtyStatus, _isFormDirty]);

  const [isAdding, setIsAdding] = useState(false);
  const handleSubmit = async (data: ChapterRequest) => {
    try {
      setIsAdding(true);
      // Update
      if (editData) {
        // remove old images
        await client.collection(COLLECTION.CHAPTER).update(editData.id, {
          images: null,
        });

        // Then update
        await client.collection(COLLECTION.CHAPTER).update(editData.id, transformToFormData(data));

        // On demand isr
        try {
          await fetch(`/api/revalidate?secret=${process.env.MY_SECRET_TOKEN}&cid=${editData.id}`);
        } catch (error) {}
      } else {
        // Create
        const res = await client
          .collection(COLLECTION.CHAPTER)
          .create(transformToFormData({ ...data, belong_to: mid }));

        // Update chapters in manga
        client
          .collection(COLLECTION.MANGAS)
          .getOne(mid)
          .then(async (mangaDetails: Record) => {
            try {
              await client.collection(COLLECTION.MANGAS).update(mid, {
                chapters: mangaDetails.chapters.concat(res.id),
              });
            } catch (error) {
              console.error(error);
            }
          })
          .catch(console.error);

        // On demand isr
        try {
          await fetch(`/api/revalidate?secret=${process.env.MY_SECRET_TOKEN}&cid=${res.id}`);
        } catch (error) {}
      }
      showNotification({
        title: 'Thao tác thành công',
        message: editData ? 'Chương đã được cập nhật' : 'Chương đã được thêm mới',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      mutate('chapters-table');
      reset();
      formStateReset();
      hideDrawer();
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: editData ? 'Chương chưa được cập nhật. Hãy thử lại nhé' : 'Chương chưa được thêm mới. Hãy thử lại nhé',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)} style={{ width: '99%' }}>
      <TextInput label="Tên chương" placeholder="Chap 1" withAsterisk {...getInputProps('name')} />

      <FileInput
        placeholder="Upload ảnh cho chương"
        label="Ảnh của chương"
        mt="sm"
        withAsterisk
        multiple
        valueComponent={FileInputPreview}
        {...getInputProps('images')}
      />

      <Button type="submit" my="lg" loading={isAdding}>
        {editData ? 'Lưu chỉnh sửa' : 'Thêm mới'}
      </Button>
    </form>
  );
};

export default FormChapter;
