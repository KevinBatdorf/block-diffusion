import apiFetch from '@wordpress/api-fetch';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type GlobalTypes = {
    prompts: string[];
    addPrompt: (prompt: string) => void;
    clearPrompts: () => void;
    apiKey: string;
    setApiKey: (apiKey: string) => void;
    deleteApiKey: () => void;
};
const path = '/wp/v2/settings';
const getSettings = async (name: string) => {
    const allSettings = await apiFetch({ path });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    return allSettings?.[name];
};
export const useGlobalStore = create<GlobalTypes>()(
    persist(
        devtools(
            (set) => ({
                prompts: [],
                addPrompt: (prompt: string) => {
                    // Only save past 10 prompts
                    set((state) => ({
                        prompts: [prompt, ...state.prompts].slice(0, 10),
                    }));
                },
                clearPrompts: () => set({ prompts: [] }),
                apiKey: '',
                setApiKey: (apiKey) => set({ apiKey }),
                deleteApiKey: () => set({ apiKey: '' }),
            }),
            { name: 'Stable Diffusion Data' },
        ),
        {
            name: 'stable_diffusion_settings',
            getStorage: () => ({
                getItem: async (name: string) => {
                    const settings = await getSettings(name);
                    return JSON.stringify({
                        version: settings.version,
                        state: settings,
                    });
                },
                setItem: async (name: string, value: string) => {
                    const { state, version } = JSON.parse(value);
                    const data = {
                        [name]: Object.assign(
                            (await getSettings(name)) ?? {},
                            state,
                            version,
                        ),
                    };
                    await apiFetch({ path, method: 'POST', data });
                },
                removeItem: () => undefined,
            }),
        },
    ),
);
