import create from "zustand";

export type UseFormStateReturn<T> = {
  isDirty: boolean;
  editData: T | null;
  reset: () => void;
  changeDirtyStatus: (value: boolean) => void;
  updateEditData: (data: T | null) => void;
};

export const useFormState = create<UseFormStateReturn<unknown>>((set) => ({
  isDirty: false,
  editData: null,
  reset: () => set(() => ({ isDirty: false, editData: null })),
  changeDirtyStatus: (value: boolean) => set(() => ({ isDirty: value })),
  updateEditData: (data: unknown | null) => set(() => ({ editData: data })),
}));
