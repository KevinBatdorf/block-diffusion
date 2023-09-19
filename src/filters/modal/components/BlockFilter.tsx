import {
    BlockControls,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { blockIcon } from '../../../icons';
import { useGlobalState } from '../state/global';
import { Loader } from './Loader';

export const BlockFilter = (
    // eslint-disable-next-line
    CurrentMenuItems: any,
    // eslint-disable-next-line
    props: any,
) => {
    // eslint-disable-next-line
    const { clientId } = props;
    const { setImageBlockId } = useGlobalState();
    const showMenu = useSelect(
        (select) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line - getBlock not added as a type?
            const currentBlock = select(blockEditorStore).getBlock(clientId);
            // only show on core image blocks for now
            return currentBlock.name === 'core/image';
        },
        [clientId],
    );

    if (!showMenu) {
        return <CurrentMenuItems {...props} />;
    }
    return (
        <>
            {CurrentMenuItems && <CurrentMenuItems {...props} />}
            <BlockControls controls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={blockIcon}
                        label={__('Generate AI Image', 'stable-diffusion')}
                        onClick={() => setImageBlockId(clientId)}
                    />
                </ToolbarGroup>
            </BlockControls>
            <Loader />
        </>
    );
};
