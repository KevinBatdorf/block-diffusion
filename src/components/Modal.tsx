import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { StableDiffusion } from '../models/StableDiffusion';
import { AvailableModels, ImageLike } from '../types';
import { ModalCloseButton } from './ModalCloseButton';

type ModalProps = {
    modelName?: AvailableModels;
    setImage: (image: ImageLike) => void;
    onClose: () => void;
};

export const Modal = ({ modelName, onClose, setImage }: ModalProps) => {
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
                    <div className="absolute mx-auto w-full h-full md:p-8">
                        <div
                            className="fixed inset-0 bg-black/40"
                            aria-hidden="true"
                        />
                        <div
                            data-cy-up="main-modal"
                            className="absolute top-0 right-0 m-0.5 z-10">
                            <ModalCloseButton onClose={onClose} />
                        </div>
                        <motion.div
                            key="modal"
                            id="stable-diffusion-modal-inner"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="sm:flex h-full w-full relative shadow-2xl sm:overflow-hidden max-w-screen-2xl mx-auto bg-white">
                            <Dialog.Title className="sr-only">
                                {__('Stable Diffusion', 'stable-diffusion')}
                            </Dialog.Title>
                            <div className="flex flex-col w-full relative">
                                <ModalContent
                                    setImage={setImage}
                                    modelName={modelName}
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
};
const ModalContent = ({ setImage, modelName }: ModalContent) => {
    if (modelName === 'stability-ai/stable-diffusion') {
        return <StableDiffusion setImage={setImage} />;
    }
    return null;
};
