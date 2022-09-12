import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { AvailableModels } from '../types';

type GlobalState = {
    importingMessage: string;
    currentInterface?: AvailableModels;
    setImportingMessage: (loading: string) => void;
    setCurrentInterface: (currentInterface?: AvailableModels) => void;
};

export const useGlobalState = create<GlobalState>()(
    devtools((set) => ({
        importingMessage: '',
        currentInterface: undefined,
        setImportingMessage: (importingMessage: string) => {
            set({ importingMessage });
        },
        setCurrentInterface: (currentInterface?: AvailableModels) => {
            set({ currentInterface });
        },
    })),
);
