import { Icon, Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useAuth } from '../hooks/useAuth';
import { closeXIcon, logOutIcon, settingsIcon } from '../icons';

type ModalControlsProps = {
    onClose: () => void;
    title: string;
};
export const ModalControls = ({ onClose, title }: ModalControlsProps) => {
    return (
        <div className="flex items-center justify-between w-full border-b gap-x-4 fixed md:static top-0 bg-white px-6 h-10">
            <div className="text-lg font-medium">{title}</div>
            <div className="flex gap-x-10 h-full items-center">
                <div className="flex gap-x-2">
                    <SettingsButton />
                    <LogoutButton />
                </div>
                <ModalCloseButton onClose={onClose} />
            </div>
        </div>
    );
};

export const SettingsButton = () => {
    return (
        <Tooltip text={__('Settings', 'stable-diffusion')}>
            <button
                className="block w-6 h-6 text-gray-900 p-px bg-transparent cursor-pointer outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500"
                type="button"
                onClick={() => console.log('ok')}
                aria-label={__('settings', 'stable-diffusion')}>
                <Icon icon={settingsIcon} size={24} />
            </button>
        </Tooltip>
    );
};

export const LogoutButton = () => {
    const { logout } = useAuth();
    return (
        <Tooltip text={__('Logout', 'stable-diffusion')}>
            <button
                className="block w-6 h-6 text-gray-900 p-px bg-transparent cursor-pointer outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500"
                type="button"
                data-cy="logout"
                onClick={logout}
                aria-label={__('Logout', 'stable-diffusion')}>
                <Icon icon={logOutIcon} size={24} />
            </button>
        </Tooltip>
    );
};

export const ModalCloseButton = ({ onClose }: { onClose: () => void }) => (
    <Tooltip text={__('Close', 'stable-diffusion')}>
        <button
            className="w-10 h-10 text-white bg-gray-900 cursor-pointer outline-none focus:shadow-none border border-gray-900 focus:border-wp-theme-500 -mx-6 flex items-center justify-center"
            type="button"
            onClick={onClose}
            aria-label={__('Close', 'stable-diffusion')}>
            <Icon icon={closeXIcon} size={24} />
        </button>
    </Tooltip>
);
