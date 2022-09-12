import { Button } from '@wordpress/components';
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { arrowLeft } from '@wordpress/icons';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { models } from '../models';
import { StableDiffusion } from '../models/StableDiffusion';
import { useAuthStore, useAuthStoreReady } from '../state/auth';
import { AvailableModels, ImageLike } from '../types';
import { Login, LoginWrapper } from './Login';
import { ModalCloseButton } from './ModalCloseButton';

type ModalProps = {
    modelName?: AvailableModels;
    setImage: (image: ImageLike) => void;
    onClose: () => void;
    onGoBack: () => void;
};

export const Modal = ({
    modelName,
    onClose,
    setImage,
    onGoBack,
}: ModalProps) => {
    const initialFocus = useRef(null);

    return (
        <AnimatePresence>
            {Boolean(modelName) && (
                <Dialog
                    className="stable-diffusion-editor stable-diffusion-modal"
                    static
                    data-cy-up="main-modal"
                    initialFocus={initialFocus}
                    as={motion.div}
                    key="modal"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    open={Boolean(modelName)}
                    onClose={onClose}>
                    <div className="absolute mx-auto w-full h-full md:p-8 md:flex justify-center items-center">
                        <div
                            className="fixed inset-0 bg-black/60"
                            aria-hidden="true"
                        />
                        <motion.div
                            key="modal"
                            id="stable-diffusion-modal-inner"
                            initial={{ y: 5 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="sm:flex relative shadow-2xl sm:overflow-hidden max-w-screen-2xl mx-auto bg-white">
                            <Dialog.Title className="sr-only">
                                {models.find((m) => m.id === modelName)?.name}
                            </Dialog.Title>
                            <div className="md:flex flex-col w-full relative">
                                <ModalContent
                                    setImage={setImage}
                                    modelName={modelName}
                                    onClose={onClose}
                                    onGoBack={onGoBack}
                                    initialFocus={initialFocus}
                                />
                            </div>
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
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
}: ContentWrapperProps) => (
    <>
        <div className="flex items-center justify-between w-full border-b p-4 gap-x-4 fixed md:static top-0 bg-white">
            <div className="flex gap-x-4 items-center">
                <Button icon={arrowLeft} onClick={onGoBack} />
                <div className="text-lg font-medium">{title}</div>
            </div>
            <ModalCloseButton onClose={onClose} />
        </div>
        <div className="overflow-y-scroll md:flex gap-x-16 flex-grow w-screen max-w-full pt-20 md:pt-0">
            {children}
        </div>
    </>
);
