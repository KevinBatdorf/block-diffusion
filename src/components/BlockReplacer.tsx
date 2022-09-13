import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export const BlockReplacer = ({ clientId }: { clientId: string }) => {
    const block = useSelect(
        (select) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line - replaceBlock not added as a type?
            select(blockEditorStore).getBlock(clientId ?? ''),
        [clientId],
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - replaceBlock not added as a type?
    const { replaceBlock } = useDispatch(blockEditorStore);
    useEffect(() => {
        if (!block?.name || !replaceBlock || !clientId) return;
        const blockData = createBlock('core/image');
        replaceBlock(clientId, [blockData]).then(() => {
            const { clientId } = blockData;
            // Open the modal
            window.requestAnimationFrame(() => {
                window.dispatchEvent(
                    new CustomEvent('kevinbatdorf/stable-diffusion-open', {
                        bubbles: true,
                        detail: { clientId },
                    }),
                );
            });
        });
    }, [block, replaceBlock, clientId]);

    return null;
};
