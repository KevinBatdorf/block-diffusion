import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import image from '../assets/select.png';
import { useAuth } from '../hooks/useAuth';
import { DialogWithImageModal } from '../layouts/DialogWithImage';
import { models } from '../models';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { AvailableModels } from '../types';

type ModalProps = {
    open: boolean;
    onClose: () => void;
};
export const ModalSelect = ({ onClose, open }: ModalProps) => {
    const { apiToken } = useAuthStore();
    const { logout } = useAuth();
    const { setCurrentInterface } = useGlobalState();
    const initialFocus = useRef<HTMLElement>(null);

    return (
        <DialogWithImageModal
            open={open}
            initialFocus={initialFocus}
            onClose={onClose}
            title={__('Select Model', 'stable-diffusion')}
            image={{
                href: 'https://replicate.com/stability-ai/stable-diffusion?prediction=rjcl54wakbbrfcajzllmidreya',
                title: 'phase shift into an era of human+AI art collab',
                url: image,
            }}>
            {models.map((model) => (
                <ModelButton
                    key={model.id}
                    {...model}
                    onClick={() =>
                        setCurrentInterface(model.id as AvailableModels)
                    }
                />
            ))}
            <div className="fixed bottom-8 w-full left-0 text-center">
                {/* Temporary logout button */}
                {Boolean(apiToken) && (
                    <button
                        className="relative z-30 text-white bg-transparent focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 focus:shadow-none opacity-80 hover:opacity-100"
                        onClick={logout}>
                        {__('Logout', 'stable-diffusion')}
                    </button>
                )}
            </div>
        </DialogWithImageModal>
    );
};
type ModelButtonProps = {
    name: string;
    description: string;
    active: boolean;
    hideFromList: boolean;
    onClick: () => void;
};
const ModelButton = ({
    name,
    description,
    active,
    hideFromList,
    onClick,
}: ModelButtonProps) => {
    if (hideFromList) return null;
    if (!active) {
        return (
            <div className="text-left w-full p-4 bg-gray-50 border border-gray-500">
                <span className="text-xs block uppercase font-bold mb-2 text-wp-theme-500">
                    {__('Coming Soon', 'stable-diffusion')}
                </span>
                <span className="font-medium text-lg mb-4 text-gray-900">
                    {name}
                </span>
                <p className="m-0 leading-tight text-gray-700">{description}</p>
            </div>
        );
    }
    return (
        <button
            className="text-left w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-500 focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 cursor-pointer focus:shadow-none"
            onClick={onClick}>
            <span className="font-medium text-lg mb-4 text-gray-900">
                {name}
            </span>
            <p className="m-0 leading-tight text-gray-700">{description}</p>
        </button>
    );
};
