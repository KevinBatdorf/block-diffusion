import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Loader } from './Loader';

export const BlockFilter = (
    // eslint-disable-next-line
    CurrentMenuItems: any,
    // eslint-disable-next-line
    props: any,
) => {
    // eslint-disable-next-line
    const { attributes, setAttributes, clientId } = props;
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
            <CurrentMenuItems {...props} />
            <Loader
                attributes={attributes}
                setAttributes={setAttributes}
                clientId={clientId}
            />
        </>
    );
};
