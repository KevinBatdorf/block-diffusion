import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type GlobalState = {
    importing: string | boolean;
    prompt?: string;
    loading: boolean;
    setImporting: (loading: string | boolean) => void;
    setLoading: (loading: boolean) => void;
    setPrompt: (searchTerm: string) => void;
};

export const useGlobalState = create<GlobalState>()(
    devtools(
        persist(
            (set) => ({
                importing: false,
                loading: false,
                prompt: undefined,
                setPrompt: (prompt) => {
                    set(() => ({ prompt }));
                },
                setImporting: (importing: boolean | string) => {
                    set((state) => ({ ...state, importing }));
                },
                setLoading: (loading: boolean) => {
                    set((state) => ({ ...state, loading }));
                },
            }),
            {
                name: 'stable-diffusion-state',
                getStorage: () => localStorage,
            },
        ),
    ),
);
