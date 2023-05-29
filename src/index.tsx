import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import blockConfig from './block.json';
import './editor.css';
import { BlockFilter } from './filters/modal/components/BlockFilter';
import { blockIcon } from './filters/modal/icons';

registerBlockType('kevinbatdorf/stable-diffusion', {
    ...blockConfig,
    icon: blockIcon,
    attributes: {},
    title: __('Block Diffusion', 'stable-diffusion'),
    edit: ({ clientId }) => <>{clientId}</>,
    save: () => null,
});

addFilter(
    'editor.BlockEdit',
    blockConfig.name,
    (CurrentMenuItems) =>
        // Not sure how to type these incoming props
        // eslint-disable-next-line
        (props: any) =>
            BlockFilter(CurrentMenuItems, props),
);
