import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { AvailableModels } from '../types';

type GlobalState = {
    importingMessage: string;
    currentInterface: AvailableModels;
    showSelectScreen: boolean;
    imageBlockId: string;
    maybeImporting: boolean;
    setMaybeImporting: (maybeImporting: boolean) => void;
    setShowSelectScreen: (show: boolean) => void;
    setImportingMessage: (loading: string) => void;
    setCurrentInterface: (currentInterface: AvailableModels) => void;
    setImageBlockId: (imageBlockId: string) => void;
};

export const useGlobalState = create<GlobalState>()(
    devtools((set, get) => ({
        importingMessage: '',
        currentInterface: 'stability-ai/stable-diffusion',
        showSelectScreen: false,
        imageBlockId: '',
        maybeImporting: false,
        setMaybeImporting: (maybeImporting) => set({ maybeImporting }),
        setShowSelectScreen: (show) => set({ showSelectScreen: show }),
        setImportingMessage: (importingMessage: string) => {
            set({ importingMessage });
        },
        setCurrentInterface: (currentInterface: AvailableModels) => {
            set({ currentInterface });
            if (currentInterface) return;
            get().setShowSelectScreen(false);
        },
        setImageBlockId: (imageBlockId: string) => {
            set({ imageBlockId });
        },
    })),
);
