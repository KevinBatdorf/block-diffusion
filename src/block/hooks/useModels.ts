import useSWR from 'swr';
import { API_PREFIX } from '../constants';

// TODO: Add support for other models and dynamically fetch them
const fetcher = () => Promise.resolve(['stability-ai/stable-diffusion']);

export const useModels = () => {
    const { data, error } = useSWR(`${API_PREFIX}/get-models`, fetcher);

    return {
        models: data,
        loading: !error && !data,
        error,
    };
};
