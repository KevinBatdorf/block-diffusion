import { Icon, Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useAuth } from '../hooks/useAuth';
import { closeXIcon } from '../icons';
import { useGlobalState } from '../state/global';

type ModalControlsProps = {
    onClose: () => void;
    title: string;
};
export const ModalControls = ({ onClose, title }: ModalControlsProps) => {
    return (
        <div className="flex items-center w-full border-b fixed md:static top-0 bg-white h-10">
            <div className="flex-shrink-0 font-mono font-semibold text-sm px-6">
                {title}
            </div>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <SwitchButton />
                    <SettingsButton />
                </div>
                <div className="flex gap-x-2 h-full items-center justify-end">
                    <LogoutButton />
                    <ModalCloseButton onClose={onClose} />
                </div>
            </div>
        </div>
    );
};

const toolbarBtnClx =
    'flex gap-1 items-center justify-center text-xs text-gray-900 px-2 bg-transparent hover:bg-gray-100 h-8 cursor-pointer outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500';

export const SettingsButton = () => {
    const { setSettingsTab } = useGlobalState();
    return (
        <button
            className={toolbarBtnClx}
            type="button"
            onClick={() => setSettingsTab('optins')}>
            {/* <Icon icon={settingsIcon} size={20} /> */}
            {__('Settings', 'stable-diffusion')}
        </button>
    );
};

export const SwitchButton = () => {
    const { setShowSelectScreen } = useGlobalState();
    return (
        <button
            className={toolbarBtnClx}
            type="button"
            onClick={() => setShowSelectScreen(true)}>
            {/* <Icon icon={switchModelIcon} size={20} /> */}
            {__('Switch Models', 'stable-diffusion')}
        </button>
    );
};

export const LogoutButton = () => {
    const { logout } = useAuth();
    return (
        <button
            className={toolbarBtnClx}
            type="button"
            data-cy="logout"
            onClick={logout}
            aria-label={__('Logout', 'stable-diffusion')}>
            {/* <Icon icon={logOutIcon} size={20} /> */}
            {__('Logout', 'stable-diffusion')}
        </button>
    );
};

export const ModalCloseButton = ({ onClose }: { onClose: () => void }) => (
    <Tooltip text={__('Close', 'stable-diffusion')}>
        <button
            className="w-10 h-10 text-white bg-gray-900 cursor-pointer outline-none focus:shadow-none border border-gray-900 focus:border-wp-theme-500 flex items-center justify-center"
            type="button"
            onClick={onClose}
            aria-label={__('Close', 'stable-diffusion')}>
            <Icon icon={closeXIcon} size={20} />
        </button>
    </Tooltip>
);
