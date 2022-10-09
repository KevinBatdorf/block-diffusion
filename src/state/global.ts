import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { models } from '../models';
import { AvailableModels } from '../types';

export type SettingsTabs = 'optins' | 'disables' | 'account';

type GlobalState = {
    importingMessage: string;
    currentModel: AvailableModels;
    showSelectScreen: boolean;
    imageBlockId: string;
    maybeImporting: boolean;
    settingsTab?: SettingsTabs;
    setImportingMessage: (loading: string) => void;
    goToModel: (id: AvailableModels) => void;
    setShowSelectScreen: (show: boolean) => void;
    setImageBlockId: (imageBlockId: string) => void;
    setMaybeImporting: (maybeImporting: boolean) => void;
    setSettingsTab: (tab?: SettingsTabs) => void;
};

export const useGlobalState = create<GlobalState>()(
    devtools(
        (set, get) => ({
            importingMessage: '',
            currentModel: 'stability-ai/stable-diffusion',
            showSelectScreen: false,
            imageBlockId: '',
            maybeImporting: false,
            settingsTab: undefined,
            setImportingMessage: (importingMessage: string) => {
                set({ importingMessage });
            },
            goToModel: (id) => {
                const model = models.find((m) => m.id === id);
                if (!model) return;
                set({ currentModel: model.id });
                get().setShowSelectScreen(false);
            },
            setShowSelectScreen: (show) => set({ showSelectScreen: show }),
            setImageBlockId: (imageBlockId: string) => {
                set({ imageBlockId });
            },
            setMaybeImporting: (maybeImporting) => set({ maybeImporting }),
            setSettingsTab: (tab) => set({ settingsTab: tab }),
        }),
        { name: 'Block Diffusion Global State' },
    ),
);
