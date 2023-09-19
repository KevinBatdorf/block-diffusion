import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Icon, ExternalLink } from '@wordpress/components';
import { useSelect, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { lockIcon } from '../icons';
import { BlockAttributes as Attributes } from '../types';
import { AccessManager } from './components/sidebar/AccessManager';
import { ModelManager } from './components/sidebar/ModelManager';
import { updateFormDetails } from './lib/forms';

type SidebarProps = {
    attributes: Attributes;
    setAttributes: (attributes: Partial<Attributes>) => void;
};

export const Sidebar = ({ attributes, setAttributes }: SidebarProps) => {
    const showAccessControl = Boolean(
        applyFilters('blockDiffusion.showAccessControlSettings', true) || false,
    );
    const isSavingPost = useSelect(
        (select) =>
            select('core/editor')
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore-next-line
                .isSavingPost(),
        [],
    );
    useEffect(() => {
        if (!isSavingPost) return;
        // On save, store the details about the form in a separate options table
        // so that we can retrieve it later.
        updateFormDetails(attributes).catch((error) => {
            console.error(error);
            const { createNotice } = dispatch('core/notices');
            createNotice('error', error.message, {
                isDismissible: true,
                type: 'snackbar',
            });
        });
    }, [isSavingPost, attributes]);

    return (
        <InspectorControls>
            {showAccessControl && (
                <PanelBody
                    title={__('Access Control', 'stable-diffusion')}
                    icon={<Icon icon={lockIcon} />}
                    className="block-diffusion-editor"
                    // todo: maybe show open if set to manage_options ?
                    initialOpen={false}>
                    <AccessManager {...{ attributes, setAttributes }} />
                </PanelBody>
            )}
            <PanelBody
                title={__('Models', 'stable-diffusion')}
                className="block-diffusion-editor"
                initialOpen={false}>
                <ModelManager {...{ attributes, setAttributes }} />
            </PanelBody>
            <PanelBody
                title={__('Themes', 'stable-diffusion')}
                className="block-diffusion-editor"
                initialOpen={false}>
                <p>
                    {__(
                        'Themes are planned for a future release.',
                        'stable-diffusion',
                    )}
                </p>
                <ExternalLink href="https://github.com/KevinBatdorf/block-diffusion/discussions">
                    {__('Start a discussion', 'stable-diffusion')}
                </ExternalLink>
            </PanelBody>
        </InspectorControls>
    );
};
