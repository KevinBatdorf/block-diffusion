import { Button } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { arrowLeft } from '@wordpress/icons';
import { Dialog } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { models } from '../models';
import { StableDiffusion } from '../models/StableDiffusion';
import { useAuthStore, useAuthStoreReady } from '../state/auth';
import { useGlobalState } from '../state/global';
import { AvailableModels, ImageLike } from '../types';
import { Login, LoginWrapper } from './Login';
import { ModalCloseButton } from './ModalCloseButton';

type ModalProps = {
    setImage: (image: ImageLike) => void;
    onClose: () => void;
};

export const Modal = ({ setImage, onClose }: ModalProps) => {
    const initialFocus = useRef(null);
    const { currentInterface, setCurrentInterface, setShowSelectScreen } =
        useGlobalState();
    const { apiToken } = useAuthStore();

    useEffect(() => {
        if (currentInterface) setShowSelectScreen(false);
    }, [currentInterface, setShowSelectScreen]);

    return (
        <Dialog
            className="stable-diffusion-editor stable-diffusion-modal"
            initialFocus={initialFocus}
            key="main-modal"
            open={Boolean(currentInterface)}
            onClose={onClose}>
            <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
                <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
                <AnimatePresence>
                    <motion.div
                        key="modal"
                        id="stable-diffusion-modal-inner"
                        initial={{ y: 5 }}
                        animate={{ y: 0 }}
                        exit={{ y: 0, opacity: 0 }}
                        className={classNames(
                            'sm:flex relative shadow-2xl sm:overflow-hidden max-w-screen-2xl mx-auto bg-white',
                            // Full height on model interfaces (kind of a hack to keep the login screen constrained)
                            { 'h-full': apiToken },
                        )}>
                        <Dialog.Title className="sr-only">
                            {
                                models.find((m) => m.id === currentInterface)
                                    ?.name
                            }
                        </Dialog.Title>
                        <div className="md:flex flex-col w-full relative h-screen md:h-auto">
                            <ModalContent
                                setImage={setImage}
                                modelName={currentInterface}
                                onClose={onClose}
                                onGoBack={() => {
                                    setCurrentInterface(undefined);
                                    setShowSelectScreen(true);
                                }}
                                initialFocus={initialFocus}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Dialog>
    );
};

type ModalContent = {
    setImage: (image: ImageLike) => void;
    modelName?: AvailableModels;
    onClose: () => void;
    // eslint-disable-next-line
    initialFocus: any;
    onGoBack: () => void;
};
const ModalContent = ({
    setImage,
    modelName,
    onClose,
    initialFocus,
    onGoBack,
}: ModalContent) => {
    const { apiToken } = useAuthStore();
    const ready = useAuthStoreReady();
    if (!ready) return null;

    if (!apiToken) {
        const title = __(
            'Log in to your Replicate account',
            'stable-diffusion',
        );
        return (
            <LoginWrapper>
                <ContentWrapper
                    onClose={onClose}
                    title={title}
                    onGoBack={onGoBack}>
                    <Login initialFocus={initialFocus} />
                </ContentWrapper>
            </LoginWrapper>
        );
    }
    if (modelName === 'stability-ai/stable-diffusion') {
        return (
            <ContentWrapper
                onClose={onClose}
                onGoBack={onGoBack}
                title={__('Stable Diffusion', 'stable-diffusion')}>
                <StableDiffusion
                    initialFocus={initialFocus}
                    setImage={setImage}
                />
            </ContentWrapper>
        );
    }
    return null;
};

type ContentWrapperProps = {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
    onGoBack: () => void;
};
const ContentWrapper = ({
    children,
    title,
    onClose,
    onGoBack,
}: ContentWrapperProps) => {
    const { apiToken } = useAuthStore();
    return (
        <>
            <div className="flex items-center justify-between w-full border-b p-4 gap-x-4 fixed md:static top-0 bg-white">
                <div className="flex gap-x-4 items-center">
                    <Button icon={arrowLeft} onClick={onGoBack} />
                    <div className="text-lg font-medium">{title}</div>
                </div>
                <ModalCloseButton onClose={onClose} />
            </div>
            <div
                className={classNames(
                    'overflow-y-scroll md:flex flex-grow w-screen max-w-full md:pt-0 bg-gray-50 divide-x',
                    // Full height on model interfaces (kind of a hack to keep the login screen constrained)
                    { 'h-screen lg:h-auto pt-16': apiToken },
                )}>
                {children}
            </div>
        </>
    );
};
