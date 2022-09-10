import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { AvailableModels } from '../types';

type GlobalState = {
    importingMessage: string;
    loading: boolean;
    currentInterface?: AvailableModels;
    setImportingMessage: (loading: string) => void;
    setLoading: (loading: boolean) => void;
    setCurrentInterface: (currentInterface?: AvailableModels) => void;
};

export const useGlobalState = create<GlobalState>()(
    devtools((set) => ({
        importingMessage: '',
        loading: false,
        currentInterface: undefined,
        setImportingMessage: (importingMessage: string) => {
            set({ importingMessage });
        },
        setLoading: (loading: boolean) => {
            set({ loading });
        },
        setCurrentInterface: (currentInterface: AvailableModels) => {
            set({ currentInterface });
        },
    })),
);
