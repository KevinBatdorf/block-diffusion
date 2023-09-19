import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import useSWR from 'swr';
import { API_PREFIX } from '../constants';

const fetcher = () =>
    apiFetch({
        method: 'POST',
        path: `${API_PREFIX}/login?cache=${Date.now()}`,
    });
export const useAuth = () => {
    const { data, error, mutate } = useSWR('login', fetcher);

    // if the error detail includes "authentication" then we're not logged in, check that
    const errorMessage = error?.detail
        ?.toLowerCase()
        ?.includes('authentication')
        ? __('You are not logged in.', 'block-diffusion')
        : error?.detail;

    return {
        loggedIn: data,
        error: errorMessage,
        loggingIn: !error && !data,
        mutate,
    };
};
