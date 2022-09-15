import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';

// if this component is rendered it will inject a block into the editor
export const AutoInject = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - types seem outdated
    const { insertBlocks } = useDispatch(blockEditorStore);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            insertBlocks([createBlock('kevinbatdorf/stable-diffusion')], 0);
        });
    });
    return null;
};
