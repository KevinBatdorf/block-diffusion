import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModalDefault } from '../layouts/ModalDefault';
import { models } from '../models';
import { StableDiffusion } from '../models/StableDiffusion';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { AvailableModels, ImageLike } from '../types';

type ModalProps = {
    setImage: (image: ImageLike) => void;
    onClose: () => void;
};

export const Modal = ({ setImage, onClose }: ModalProps) => {
    const initialFocus = useRef(null);
    const { currentInterface, setShowSelectScreen } = useGlobalState();
    const { apiToken } = useAuthStore();

    useEffect(() => {
        if (currentInterface) setShowSelectScreen(false);
    }, [currentInterface, setShowSelectScreen]);

    return (
        <Dialog
            className="stable-diffusion-editor stable-diffusion-modal"
            initialFocus={initialFocus}
            data-cy="model-screen"
            key="main-modal"
            open={Boolean(currentInterface) && Boolean(apiToken)}
            onClose={onClose}>
            <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />
                <AnimatePresence>
                    <motion.div
                        key="modal"
                        id="stable-diffusion-modal-inner"
                        initial={{ y: 5 }}
                        animate={{ y: 0 }}
                        exit={{ y: 0, opacity: 0 }}
                        className="sm:flex relative shadow-2xl sm:overflow-hidden max-w-screen-2xl mx-auto bg-white h-full">
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
};
const ModalContent = ({
    setImage,
    modelName,
    onClose,
    initialFocus,
}: ModalContent) => {
    if (modelName === 'stability-ai/stable-diffusion') {
        return (
            <ModalDefault
                onClose={onClose}
                title={__('Stable Diffusion', 'stable-diffusion')}>
                <StableDiffusion
                    initialFocus={initialFocus}
                    setImage={setImage}
                />
            </ModalDefault>
        );
    }
    return null;
};
