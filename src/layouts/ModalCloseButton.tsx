import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { closeX } from '../icons';

export const ModalCloseButton = ({ onClose }: { onClose: () => void }) => (
    <button
        className="block w-6 h-6 text-gray-900 p-px bg-transparent cursor-pointer outline-none focus:shadow-none focus:ring-wp focus:ring-main-blue"
        type="button"
        onClick={onClose}
        aria-label={__('Close', 'unlimited-photos')}>
        <Icon icon={closeX} size={24} />
    </button>
);
