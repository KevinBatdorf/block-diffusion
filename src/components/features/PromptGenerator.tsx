import { Icon, Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { refreshIcon } from '../../icons';
import { useSettingsStore, useSettingsStoreReady } from '../../state/settings';

export const PromptGenerator = ({
    update,
}: {
    update: (text: string) => void;
}) => {
    const { has } = useSettingsStore();
    const ready = useSettingsStoreReady();
    const handlePress = () => {
        update('ok');
    };
    if (!ready || has('disabledFeatures', 'prompt-generator')) {
        return null;
    }
    return (
        <Tooltip text={__('Generate prompt', 'stable-diffusion')}>
            <button
                className="block w-6 h-6 text-gray-900 p-px bg-transparent cursor-pointer outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 absolute top-0 right-0 spin"
                type="button"
                onClick={handlePress}
                aria-label={__('Generate prompt', 'stable-diffusion')}>
                <Icon icon={refreshIcon} size={18} />
            </button>
        </Tooltip>
    );
};
