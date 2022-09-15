import { registerBlockType } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';
import { render } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import blockConfig from './block.json';
import { AutoInject } from './components/AutoInject';
import { BlockFilter } from './components/BlockFilter';
import { BlockReplacer } from './components/BlockReplacer';
import './editor.css';
import { blockIcon } from './icons';

registerBlockType('kevinbatdorf/stable-diffusion', {
    ...blockConfig,
    icon: blockIcon,
    attributes: {},
    title: __('Block Diffusion', 'stable-diffusion'),
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
            BlockFilter(CurrentMenuItems, props),
);

// Lets users visit /post-new.php?post_type=page&block-diffusion-open
const q = new URLSearchParams(window.location.search);
if (q.has('block-diffusion-open')) {
    q.delete('block-diffusion-open');
    const blockDiffusion = Object.assign(document.createElement('div'), {
        id: 'stable-diffusion-root',
        className: 'stable-diffusion',
    });
    domReady(() => {
        window.history.replaceState({}, '', `${window.location.pathname}?${q}`);
        document.body.append(blockDiffusion);
        render(<AutoInject />, blockDiffusion);
    });
}
