import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import blockConfig from './block.json';
import { BlockFilter } from './components/BlockFilter';
import { BlockReplacer } from './components/BlockReplacer';
import './editor.css';
import { blockIcon } from './icons';

registerBlockType('kevinbatdorf/stable-diffusion', {
    ...blockConfig,
    icon: blockIcon,
    attributes: {},
    title: __('AI Prompt', 'stable-diffusion'),
    edit: ({ clientId }) => <BlockReplacer clientId={clientId} />,
    save: () => null,
});

addFilter(
    'editor.BlockEdit',
    blockConfig.name,
    (CurrentMenuItems) =>
        // Not sure how to type these incoming props
        // eslint-disable-next-line
        (props: any) =>
            // It seems like Gutenberg wants a top level component here
            BlockFilter(CurrentMenuItems, props),
);
