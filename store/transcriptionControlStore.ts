import {create} from 'zustand';

interface MenuState {
  startTranscription: boolean;
  setStartTranscription: (value: boolean) => void;

  pauseTranscription: boolean;
  setPauseTranscription: (value: boolean) => void;

  stopTranscription: boolean;
  setStopTranscription: (value: boolean) => void;

  transcript: string;
  setTranscript: (value: string, concat?: boolean) => void;

  current: string;
  setCurrent: (value: string) => void;

  start: boolean;
  setStart: (value: boolean) => void;
}

const useTranscriptionStore = create<MenuState>(set => ({
  startTranscription: false,
  setStartTranscription: value => set({startTranscription: value}),
  pauseTranscription: false,
  setPauseTranscription: value => set({pauseTranscription: value}),
  stopTranscription: false,
  setStopTranscription: value => set({stopTranscription: value}),
  transcript: '',
  setTranscript: (value, concat = false) =>
    set(state => ({
      transcript: concat ? `${state.transcript} ${value}` : value,
    })),
  current: '',
  setCurrent: value =>
    set(state => ({
      transcript: state.current + value,
    })),
  start: false,
  setStart: value => set({start: value}),
}));

export default useTranscriptionStore;
