import create from 'zustand';

export type UseNeedLoginDialog = {
  isShow: boolean;
  show: () => void;
  hide: () => void;
};

const useNeedLoginDialog = create<UseNeedLoginDialog>((set) => ({
  isShow: false,
  show: () => set(() => ({ isShow: true })),
  hide: () => set(() => ({ isShow: false })),
}));

export default useNeedLoginDialog;
