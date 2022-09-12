import apiFetch from '@wordpress/api-fetch';
import useSWRImmutable from 'swr/immutable';
import { useAuthStore } from '../state/auth';
import { AvailableModels, ModelData } from '../types';

const fetcher = (
    model: AvailableModels,
    apiToken: string,
): Promise<ModelData> =>
    apiFetch({
        method: 'GET',
        path: `kevinbatdorf/stable-diffusion/get-model?model=${model}&cache=${Date.now()}`,
        headers: { Authorization: `Token ${apiToken}` },
    });

export const useModel = (model: AvailableModels) => {
    const { apiToken } = useAuthStore();
    const { data, error } = useSWRImmutable<ModelData>(
        [model, apiToken],
        fetcher,
    );
    return { data, error, loading: !error && !data };
};
