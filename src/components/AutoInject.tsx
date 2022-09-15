import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

// if this component is rendered it will inject a block into the editor
export const AutoInject = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - types seem outdated
    const { getGlobalBlockCount } = useSelect((s) => s(blockEditorStore));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - types seem outdated
    const { insertBlocks } = useDispatch(blockEditorStore);
    const [timer, setTimer] = useState(0);
    useEffect(() => {
        const id = setTimeout(() => {
            insertBlocks([createBlock('kevinbatdorf/stable-diffusion')], 0);
            getGlobalBlockCount() || setTimer((t) => t + 1);
        }, 100);
        return () => clearTimeout(id);
    }, [insertBlocks, getGlobalBlockCount, timer]);

    return null;
};
