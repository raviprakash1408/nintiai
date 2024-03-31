import {create} from 'zustand';

interface MenuState {
  showMenu: number;
  setShowMenu: (value: number) => void;
  currentView: string;
  setCurrentView: (value: string) => void;
}

const useSubMenuedStore = create<MenuState>(set => ({
  showMenu: 0,
  setShowMenu: value => set({showMenu: value}),
  currentView: '',
  setCurrentView: value => set({currentView: value}),
}));

export default useSubMenuedStore;
