import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

type OptIns = typeof optInsOptions[number];
type DisabledFeatures = typeof disabledFeatures[number];
type SettingsFn = <T extends keyof typeof initialState>(
    type: T,
    value: typeof initialState[T][number],
) => void;
type SettingsTypes = {
    seenNotices: string[];
    optIns: OptIns[];
    disabledFeatures: DisabledFeatures[];

    add: SettingsFn;
    remove: SettingsFn;
    toggle: SettingsFn;
    has: <T extends keyof typeof initialState>(
        type: T,
        value: typeof initialState[T][number],
    ) => boolean;
};

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

export const getSettings = async (name: string) => {
    const settings = await apiFetch({
        path: '/kevinbatdorf/stable-diffusion/options',
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    return settings?.[name];
};
const storage = {
    getItem: async (name: string) => {
        const settings = await getSettings(name);
        return JSON.stringify({
            version: settings.version,
            state: settings || initialState,
        });
    },
    setItem: async (name: string, value: string) => {
        const { state, version } = JSON.parse(value);
        const data = {
            [name]: Object.assign(
                (await getSettings(name)) || initialState,
                state,
                { version },
            ),
        };
        await apiFetch({
            path: '/kevinbatdorf/stable-diffusion/options',
            method: 'POST',
            data,
        });
    },
    removeItem: () => undefined,
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
            storage: createJSONStorage(() => storage),
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
