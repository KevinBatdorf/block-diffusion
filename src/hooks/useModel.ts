import apiFetch from '@wordpress/api-fetch';
import useSWRImmutable from 'swr/immutable';
import { useAuthStore } from '../state/auth';
import { AvailableModels } from '../types';

const fetcher = async (model: AvailableModels, apiToken: string) => {
    try {
        console.log('fetching', model);
        await apiFetch({
            method: 'GET',
            path: `kevinbatdorf/stable-diffusion/get-model?model=${model}`,
            headers: { Authorization: `Token ${apiToken}` },
        });
    } catch (e) {
        console.log(e);
    }
};
export const useModel = (model: AvailableModels) => {
    const { apiToken } = useAuthStore();
    const { data, error } = useSWRImmutable([model, apiToken], fetcher);
    return { data, error, loading: !error && !data };
};
