import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthTypes = {
    apiToken: string;
    storeApiToken: (apiToken: string) => void;
    deleteApiToken: () => void;
};
const path = '/wp/v2/settings';
const getSettings = async (name: string) => {
    const allSettings = await apiFetch({ path });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    return allSettings?.[name];
};
export const useAuthStore = create<AuthTypes>()(
    persist(
        devtools(
            (set) => ({
                apiToken: '',
                storeApiToken: (apiToken) => set({ apiToken }),
                deleteApiToken: () => set({ apiToken: '' }),
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
                            (await getSettings(name)) ?? { apiToken: '' },
                            state,
                            { version },
                        ),
                    };
                    await apiFetch({ path, method: 'POST', data });
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
