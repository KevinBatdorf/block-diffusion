import apiFetch from '@wordpress/api-fetch';
import { useEffect, useRef } from '@wordpress/element';
import useSWRImmutable from 'swr/immutable';
import { PredictionData } from '../../../types';
import { API_PREFIX } from '../constants';

const fetcher = (predictionId: string): Promise<PredictionData> =>
    apiFetch({
        method: 'GET',
        path: `${API_PREFIX}/get-prediction?id=${predictionId}&cache=${Date.now()}`,
    });

export const usePrediction = (id: string) => {
    const paused = useRef(false);
    const { data, error } = useSWRImmutable<PredictionData>(
        id ? id : null,
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
