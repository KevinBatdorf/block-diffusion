import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getSettings } from '../lib/wp';

const optInsOptions = [
    'prompt-accept', // user has accepted to request prompts
    'prompt-share', // user has accepted to share their prompts
] as const;
const disabledFeatures = [
    'prompt-generator', // User disabled the prompt generator UI
] as const;
const initialState = {
    seenNotices: [] as string[],
    optIns: [] as OptIns[],
    disabledFeatures: [] as DisabledFeatures[],
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
                        [type]: state[type].includes(value as never)
                            ? state[type].filter((v) => v !== value)
                            : [...state[type], value],
                    }));
                },
                has: (type, value) => {
                    return get()[type].includes(value as never);
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

type OptIns = typeof optInsOptions[number];
type DisabledFeatures = typeof disabledFeatures[number];
type SettingsFn = <T extends keyof typeof initialState>(
    type: T,
    value: typeof initialState[T][number],
) => void | boolean;
type SettingsTypes = {
    seenNotices: string[];
    optIns: OptIns[];
    disabledFeatures: DisabledFeatures[];

    add: SettingsFn;
    remove: SettingsFn;
    toggle: SettingsFn;
    has: SettingsFn;
};
