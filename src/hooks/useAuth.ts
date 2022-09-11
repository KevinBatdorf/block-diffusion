import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState } from '@wordpress/element';
import useSWR from 'swr';
import { useAuthStore, useAuthStoreReady } from '../state/auth';

const fetcher = async (apiToken: string) => {
    await apiFetch({
        method: 'POST',
        path: 'kevinbatdorf/stable-diffusion/login',
        headers: { Authorization: `Token ${apiToken}` },
    });
    // If it doesn't throw, it's good
    return true;
};

export const useAuth = () => {
    const [apiToken, setApiToken] = useState(
        useAuthStore((state) => state.apiToken),
    );
    const ready = useAuthStoreReady();
    const { deleteApiToken } = useAuthStore();
    const { data, error } = useSWR(
        ready && apiToken ? apiToken : null,
        fetcher,
    );
    if (error && apiToken) {
        setApiToken('');
    }
    useEffect(() => {
        if (!apiToken) deleteApiToken();
    }, [apiToken, deleteApiToken]);

    return {
        success: data,
        error,
        loading: !!apiToken && !error && !data,
        login(token: string) {
            setApiToken(token);
        },
    };
};
