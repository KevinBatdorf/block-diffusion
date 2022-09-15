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
    const { apiToken, storeApiToken } = useAuthStore();
    const { data, error } = useSWRImmutable<ModelData>(
        [model, apiToken],
        fetcher,
    );
    // check if error is 401
    if (error?.detail === 'Invalid token.') {
        console.error(error);
        storeApiToken('');
    }
    return { data, error, loading: !error && !data };
};
