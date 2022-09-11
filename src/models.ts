import { __ } from '@wordpress/i18n';
import { ModelAttributes } from './types';

export const models: ModelAttributes[] = [
    {
        id: 'stability-ai/stable-diffusion',
        name: __('AI Prompt To Image', 'stable-diffusion'),
        description: __(
            'A latent text-to-image diffusion model capable of generating photo-realistic images given any text input',
            'stable-diffusion',
        ),
        active: true,
    },
    {
        id: 'tencentarc/gfpgan',
        name: __('Reverse Image To Prompt', 'stable-diffusion'),
        description: __(
            'Get an approximate text prompt, with style, matching an image that you provide',
            'stable-diffusion',
        ),
        active: false,
    },
    {
        id: 'methexis-inc/img2prompt',
        name: __('Face Restoration', 'stable-diffusion'),
        description: __(
            'Practical face restoration algorithm for *old photos* or *AI-generated faces*',
            'stable-diffusion',
        ),
        active: false,
    },
    {
        id: 'deforum/deforum_stable_diffusion',
        name: __('AI Prompt Animation', 'stable-diffusion'),
        description: __(
            'Animating prompts with stable diffusion',
            'stable-diffusion',
        ),
        active: false,
    },
];
