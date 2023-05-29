import { __ } from '@wordpress/i18n';
import { ModelAttributes } from './types';

export const models: ModelAttributes[] = [
    {
        id: 'stability-ai/stable-diffusion',
        name: __('Stable Diffusion V2', 'stable-diffusion'),
        description: __(
            'A latent text-to-image diffusion model capable of generating photo-realistic images given any text input',
            'stable-diffusion',
        ),
        image: 'https://bucketeer-be99e627-94e7-4e5b-a292-54eeb40ac303.s3.amazonaws.com/public/models_models_featured_image/c63d605d-b5e3-4fb0-9b0d-79f00a710f7c/out-0.png',
    },
    {
        id: 'lambdal/text-to-pokemon',
        name: __('Text to Pokémon', 'stable-diffusion'),
        description: __(
            'Generate Pokémon from a text description',
            'stable-diffusion',
        ),
        image: 'https://bucketeer-be99e627-94e7-4e5b-a292-54eeb40ac303.s3.amazonaws.com/public/models_models_cover_image/05b2d987-7b48-4ecf-b08f-c949d763be3e/pokemontage.jpg',
    },
    {
        id: 'prompthero/openjourney',
        name: __('MidJourney Style Images', 'stable-diffusion'),
        description: __(
            'Stable Diffusion fine tuned on Midjourney v4 images',
            'stable-diffusion',
        ),
        image: 'https://bucketeer-be99e627-94e7-4e5b-a292-54eeb40ac303.s3.amazonaws.com/public/models_models_featured_image/bf86b681-da40-4090-88bb-73a1f060dc5c/out-0-4.png',
    },
    // {
    //     id: 'tencentarc/gfpgan',
    //     name: __('Reverse Image to Prompt', 'stable-diffusion'),
    //     description: __(
    //         'Get an approximate text prompt, with style, matching an image that you provide',
    //         'stable-diffusion',
    //     ),
    // },
    // {
    //     id: 'methexis-inc/img2prompt',
    //     name: __('Face Restoration', 'stable-diffusion'),
    //     description: __(
    //         'Practical face restoration algorithm for *old photos* or *AI-generated faces*',
    //         'stable-diffusion',
    //     ),
    // },
    // {
    //     id: 'deforum/deforum_stable_diffusion',
    //     name: __('Prompt Animation', 'stable-diffusion'),
    //     description: __(
    //         'Animating prompts with stable diffusion',
    //         'stable-diffusion',
    //     ),
    // },
];
