import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { AvailableModels } from '../types';

export type SettingsTabs = 'optins' | 'disables' | 'account';

type GlobalState = {
    importingMessage: string;
    currentInterface: AvailableModels;
    showSelectScreen: boolean;
    imageBlockId: string;
    maybeImporting: boolean;
    settingsTab?: SettingsTabs;
    setImportingMessage: (loading: string) => void;
    setCurrentInterface: (currentInterface: AvailableModels) => void;
    setShowSelectScreen: (show: boolean) => void;
    setImageBlockId: (imageBlockId: string) => void;
    setMaybeImporting: (maybeImporting: boolean) => void;
    setSettingsTab: (tab?: SettingsTabs) => void;
};

export const useGlobalState = create<GlobalState>()(
    devtools((set, get) => ({
        importingMessage: '',
        currentInterface: 'stability-ai/stable-diffusion',
        showSelectScreen: false,
        imageBlockId: '',
        maybeImporting: false,
        settingsTab: undefined,
        setImportingMessage: (importingMessage: string) => {
            set({ importingMessage });
        },
        setCurrentInterface: (currentInterface: AvailableModels) => {
            set({ currentInterface });
            if (currentInterface) return;
            get().setShowSelectScreen(false);
        },
        setShowSelectScreen: (show) => set({ showSelectScreen: show }),
        setImageBlockId: (imageBlockId: string) => {
            set({ imageBlockId });
        },
        setMaybeImporting: (maybeImporting) => set({ maybeImporting }),
        setSettingsTab: (tab) => set({ settingsTab: tab }),
    })),
);
