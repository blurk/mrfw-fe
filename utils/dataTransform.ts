import { Record as PBRecord } from 'pocketbase';

export const serverDataTransform = (item: PBRecord) => ({
  ...item,
  collectionId: item['@collectionId'],
  collectionName: item['@collectionName'],
  expand: item['@expand'] ?? undefined,
});

export const transformToFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Array.isArray(value) && value.length > 1) {
      for (let i = 0; i < value.length; i++) {
        formData.append(key, value[i]);
      }
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

export const parseServerData = (data: any) => JSON.parse(JSON.stringify(data));
