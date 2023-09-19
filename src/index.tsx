import { useBlockProps as blockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import blockConfig from './block.json';
import { PromptArea } from './block/PromptArea';
import { Sidebar } from './block/Sidebar';
import { BlockOutput } from './block/front/BlockOutput';
import './editor.css';
import { BlockFilter } from './filters/modal/components/BlockFilter';
import { blockIcon } from './icons';
import { BlockAttributes as Attributes } from './types';

registerBlockType<Attributes>('kevinbatdorf/stable-diffusion', {
    ...blockConfig,
    icon: blockIcon,
    attributes: {
        id: { type: 'string' },
        startingModel: {
            type: 'string',
            default: '',
        },
        availableModels: {
            type: 'array',
            default: [],
        },
        capabilityRestriction: {
            type: 'array',
            default: [],
        },
        promptSuggestions: {
            type: 'array',
            default: [],
        },
    },
    title: __('Block Diffusion', 'stable-diffusion'),
    edit: ({ attributes, setAttributes, clientId }) => {
        return (
            <div {...blockProps()}>
                <Sidebar {...{ attributes, setAttributes }} />
                <PromptArea {...{ attributes, setAttributes, clientId }} />
            </div>
        );
    },
    save: ({ attributes }) => <BlockOutput {...{ attributes }} />,
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
