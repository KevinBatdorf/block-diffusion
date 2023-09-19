import apiFetch from '@wordpress/api-fetch';
import useSWR from 'swr';
import { API_PREFIX } from '../constants';

const fetcher = (route: string) =>
    apiFetch({
        method: 'GET',
        path: `${route}?cache=${Date.now()}`,
    });

type Capability = {
    [key: string]: string[];
};

export const useCapabilities = () => {
    const { data, error } = useSWR(`${API_PREFIX}/get-capabilities`, fetcher);

    return {
        capabilities: data as Capability,
        loading: !error && !data,
        error,
    };
};
