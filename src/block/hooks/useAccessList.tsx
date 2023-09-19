import apiFetch from '@wordpress/api-fetch';
import useSWR from 'swr';
import { API_PREFIX } from '../constants';

const fetcher = (route: string) =>
    apiFetch({
        method: 'GET',
        path: `${route}?cache=${Date.now()}`,
    });

type List = {
    [key: string]: string[];
};

export const useAccessList = (id?: string) => {
    // waits for an id to be passed in before fetching
    const { data, error } = useSWR(
        id ? `${API_PREFIX}/access-list` : null,
        fetcher,
    );

    return {
        accessList: data as List,
        loading: !error && !data,
        error,
    };
};
