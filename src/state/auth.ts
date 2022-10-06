import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getSettings } from '../lib/wp';

type AuthTypes = {
    apiToken: string;
    storeApiToken: (apiToken: string) => void;
    deleteApiToken: () => void;
};
const initialState = { apiToken: '' };

export const useAuthStore = create<AuthTypes>()(
    persist(
        devtools(
            (set) => ({
                ...initialState,
                storeApiToken: (apiToken) => set({ apiToken }),
                deleteApiToken: () => set({ apiToken: '' }),
            }),
            { name: 'Block Diffusion Auth' },
        ),
        {
            name: 'stable_diffusion_settings',
            getStorage: () => ({
                getItem: async (name: string) => {
                    const settings = await getSettings(name, initialState);
                    return JSON.stringify({
                        version: settings.version,
                        state: settings,
                    });
                },
                setItem: async (name: string, value: string) => {
                    const { state, version } = JSON.parse(value);
                    const data = {
                        [name]: Object.assign(
                            await getSettings(name, initialState),
                            // filter out items not in the initial state
                            state,
                            { version },
                        ),
                    };
                    await apiFetch({
                        path: '/wp/v2/settings',
                        method: 'POST',
                        data,
                    });
                },
                removeItem: () => undefined,
            }),
        },
    ),
);

export const useAuthStoreReady = () => {
    const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated);
    useEffect(() => {
        const unsubFinishHydration = useAuthStore.persist.onFinishHydration(
            () => setHydrated(true),
        );
        return () => {
            unsubFinishHydration();
        };
    }, []);
    return hydrated;
};
