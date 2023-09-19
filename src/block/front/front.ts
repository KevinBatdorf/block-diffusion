import { BlockAttributes } from '../../types';

const init = async () => {
    const { restUrl, nonce } = window?.blockDiffusion ?? {};
    if (!restUrl || !nonce) return;

    const blocks = document.querySelectorAll(
        '.block-diffusion:not(.block-diffusion--initialized)',
    );
    if (!blocks.length) return;
    console.log(blocks);

    const runPrediction = async ({
        id,
        startingModel,
    }: Partial<BlockAttributes>) => {
        const res = await fetch(restUrl + '/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify({
                id,
                model: startingModel,
                prompt: '',
            }),
        });
        console.log(await res.json());
    };

    blocks.forEach((block) => {
        block.classList.add('block-diffusion--initialized');
        block
            .querySelector('.block-diffusion-form')
            ?.addEventListener('submit', (e) => {
                e.preventDefault();
                const { id, startingModel } = JSON.parse(
                    (e.target as HTMLFormElement)?.dataset?.attributes ?? '{}',
                );
                runPrediction({ id, startingModel });
            });
    });
};

// Useful for when the DOM is modified or loaded in late
window.blockDiffusionInit = init;

// Functions are idempotent, so we can run them on load and DOMContentLoaded
window.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);
init();
