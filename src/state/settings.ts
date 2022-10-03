import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getSettings } from '../lib/wp';

type SettingsTypes = {
    seenNotices: string[];
    optIns: string[];
    disabledFeatures: string[];
    add: (type: keyof typeof initialState, value: string) => void;
    remove: (type: keyof typeof initialState, value: string) => void;
    toggle: (type: keyof typeof initialState, value: string) => void;
    has: (type: keyof typeof initialState, value: string) => boolean;
};
const initialState = {
    seenNotices: [],
    optIns: [],
    disabledFeatures: [],
};

export const useSettingsStore = create<SettingsTypes>()(
    persist(
        devtools(
            (set, get) => ({
                ...initialState,
                add: (type, value) => {
                    set((state) => ({
                        [type]: [...state[type], value],
                    }));
                },
                remove: (type, value) => {
                    set((state) => ({
                        [type]: state[type].filter((v) => v !== value),
                    }));
                },
                toggle: (type, value) => {
                    set((state) => ({
                        [type]: state[type].includes(value)
                            ? state[type].filter((v) => v !== value)
                            : [...state[type], value],
                    }));
                },
                has: (type, value) => {
                    return get()[type].includes(value);
                },
            }),
            { name: 'Block Diffusion Options' },
        ),
        {
            name: 'stable_diffusion_options',
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

export const useSettingsStoreReady = () => {
    const [hydrated, setHydrated] = useState(
        useSettingsStore.persist.hasHydrated,
    );
    useEffect(() => {
        const unsubFinishHydration = useSettingsStore.persist.onFinishHydration(
            () => setHydrated(true),
        );
        return () => {
            unsubFinishHydration();
        };
    }, []);
    return hydrated;
};
