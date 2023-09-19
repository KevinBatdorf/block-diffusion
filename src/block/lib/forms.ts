import apiFetch from '@wordpress/api-fetch';
import { BlockAttributes } from '../../types';
import { API_PREFIX } from '../constants';

export const updateFormDetails = async (attributes: BlockAttributes) => {
    const { id, ...data } = attributes;
    console.log({ id, data });
    const response = await apiFetch<Response>({
        method: 'POST',
        path: `${API_PREFIX}/access-list?cache=${Date.now()}`,
        data: { id, data },
        parse: false,
    }).catch((e) => e);
    if (!response.ok) {
        const error = (await response.json()) as { message: string };
        throw new Error(error.message);
    }
};
