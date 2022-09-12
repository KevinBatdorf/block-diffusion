import apiFetch from '@wordpress/api-fetch';
import { useEffect, useRef } from '@wordpress/element';
import useSWRImmutable from 'swr/immutable';
import { useAuthStore } from '../state/auth';
import { PredictionData } from '../types';

const fetcher = (
    predictionId: string,
    apiToken: string,
): Promise<PredictionData> =>
    apiFetch({
        method: 'GET',
        path: `kevinbatdorf/stable-diffusion/get-prediction?id=${predictionId}&cache=${Date.now()}`,
        headers: { Authorization: `Token ${apiToken}` },
    });

export const usePrediction = (id: string) => {
    const { apiToken } = useAuthStore();
    const paused = useRef(false);
    const { data, error } = useSWRImmutable<PredictionData>(
        id ? [id, apiToken] : null,
        fetcher,
        {
            refreshInterval: 1000,
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            isPaused: () => paused.current,
        },
    );

    if (['succeeded', 'failed', 'canceled'].includes(data?.status ?? '')) {
        paused.current = true;
    }

    useEffect(() => {
        paused.current = false;
    }, [id]);

    return { data, error, loading: !error && !data };
};
