import apiFetch from '@wordpress/api-fetch';
import useSWRImmutable from 'swr/immutable';
import { AvailableModels, ModelData } from '../types';

const fetcher = (model: AvailableModels): Promise<ModelData> =>
    apiFetch({
        method: 'GET',
        path: `kevinbatdorf/stable-diffusion/get-model?model=${model}&cache=${Date.now()}`,
    });

export const useModel = (model: AvailableModels) => {
    const { data, error } = useSWRImmutable<ModelData>(model, fetcher);
    return { data, error, loading: !error && !data };
};
