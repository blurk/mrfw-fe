import { Button, FileInput, MultiSelect, Select, Textarea, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import FileInputPreview from 'components/atoms/FileInputPreview';
import { useEffect, useState } from 'react';
import { getAuthors, getGenres } from 'services/fetchers';
import client from 'services/initPocketBase';
import useSWR, { useSWRConfig } from 'swr';
import { Manga, MangaUploadRequest, SWRMangaUploadFormStatus, User } from 'domains';
import { COLLECTION, MANGA_STATUS, transformToFormData, uploadMangaSchema } from 'utils';
import { useFormState, UseFormStateReturn } from 'utils/hooks/useFormState';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons';

type Props = {
  hideDrawer: () => void;
};

const getInitialValues = (data?: SWRMangaUploadFormStatus['editData']) =>
  data
    ? {
        ...data,
        cover: `${process.env.NEXT_PUBLIC_FILES_URL}/mangas/${data.id}/${data.cover}`,
      }
    : {
        ...uploadMangaSchema.cast({}),
        upload_by: (client.authStore.model as User)?.id ?? '',
      };

const FormUploadManga = ({ hideDrawer }: Props) => {
  const { mutate } = useSWRConfig();

  const { editData, changeDirtyStatus, reset: formStateReset } = useFormState() as UseFormStateReturn<Manga>;

  const { onSubmit, getInputProps, isDirty, reset, setFieldValue, values } = useForm<MangaUploadRequest>({
    validate: yupResolver(uploadMangaSchema),
    initialValues: getInitialValues(editData),
  });

  const _isFormDirty = isDirty();

  useEffect(() => {
    changeDirtyStatus(_isFormDirty);
  }, [changeDirtyStatus, _isFormDirty]);

  const [isAdding, setIsAdding] = useState(false);
  const handleSubmit = async (data: MangaUploadRequest) => {
    try {
      setIsAdding(true);
      if (editData) {
        await client.collection(COLLECTION.MANGAS).update(editData.id, transformToFormData(data));
      } else {
        // Create the manga
        const manga = await client.collection(COLLECTION.MANGAS).create(transformToFormData({ ...data }));

        // Create a row in views table
        const view = await client.collection(COLLECTION.VIEWS).create({
          manga: manga.id,
        });

        // Update the manga with the new view
        await client.collection(COLLECTION.MANGAS).update(manga.id, {
          view: view.id,
        });
      }
      showNotification({
        title: 'Thao tác thành công',
        message: editData ? 'Truyện đã được cập nhật' : 'Truyện đã được thêm mới',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      mutate('uploaded-manga');
      reset();
      formStateReset();
      hideDrawer();
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: editData ? 'Truyện chưa được cập nhật. Hãy thử lại nhé' : 'Truyện chưa được thêm mới. Hãy thử lại nhé',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const { data: genres, mutate: genresMutate } = useSWR('api_genres', getGenres);

  const handleGenreCreate = async (newGenre: string) => {
    try {
      const record = await client.collection(COLLECTION.GENERS).create({ name: newGenre });
      genresMutate([...(genres ?? []), { label: newGenre, value: record.id }]);
      showNotification({
        title: 'Thao tác thành công',
        message: 'Thêm thể loại mới thành công!',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      setFieldValue('genres', [...values.genres, record.id]);
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: 'Thêm thể loại mới thất bại!',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const { data: authors, mutate: authorMutate } = useSWR('api_authors', getAuthors);

  const handleAuthorCreate = async (newAuthor: string) => {
    try {
      const record = await client.collection(COLLECTION.AUTHORS).create({
        name: newAuthor,
      });
      authorMutate([...(authors ?? []), { label: newAuthor, value: record.id }]);

      showNotification({
        title: 'Thao tác thành công',
        message: 'Thêm tác giả mới thành công!',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });

      setFieldValue('author', [...values.author, record.id]);
    } catch (error) {
      showNotification({
        title: 'Thao tác thất bại',
        message: 'Thêm tác giả mới thất bại!',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)} style={{ width: '99%' }}>
      <TextInput label="Tên truyện" placeholder="Doraemon" withAsterisk {...getInputProps('title')} />

      <Select
        label="Trạng thái"
        placeholder="Chọn một"
        mt="sm"
        withAsterisk
        data={MANGA_STATUS}
        {...getInputProps('status')}
      />

      <MultiSelect
        label="Thể loại"
        placeholder="Chọn một hoặc nhiều thể loại"
        mt="sm"
        withAsterisk
        searchable
        multiple
        nothingFound="Không tìm thấy thể loại"
        maxDropdownHeight={160}
        data={genres ?? []}
        creatable
        getCreateLabel={(query) => `+ Thêm mới ${query}`}
        onCreate={handleGenreCreate}
        {...getInputProps('genres')}
        sx={{ flex: 1 }}
      />

      <MultiSelect
        label="Tác giả"
        placeholder="Chọn một hoặc nhiều tác giả"
        mt="sm"
        withAsterisk
        searchable
        multiple
        nothingFound="Không tìm thấy tác giả"
        maxDropdownHeight={160}
        data={authors ?? []}
        creatable
        getCreateLabel={(query) => `+ Thêm mới ${query}`}
        onCreate={handleAuthorCreate}
        {...getInputProps('author')}
        sx={{ flex: 1 }}
      />

      <Textarea
        label="Tóm tắt truyện"
        placeholder="Nội dung tóm tắt..."
        withAsterisk
        autosize
        minRows={5.5}
        maxRows={5.5}
        {...getInputProps('description')}
      />

      <FileInput
        placeholder="Chọn một ảnh bìa"
        label="Ảnh bìa"
        withAsterisk
        valueComponent={FileInputPreview}
        {...getInputProps('cover')}
      />

      <Button type="submit" my="lg" loading={isAdding}>
        {editData ? 'Lưu chỉnh sửa' : 'Thêm mới'}
      </Button>
    </form>
  );
};

export default FormUploadManga;
