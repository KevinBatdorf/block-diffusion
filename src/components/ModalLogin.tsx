import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import image from '../assets/login.png';
import { ModalCloseButton } from '../layouts/ModalCloseButton';

export const ModalLogin = ({ onClose, open, initialFocus, children }) => {
    return (
        <Dialog
            className="stable-diffusion-editor stable-diffusion-modal"
            initialFocus={initialFocus}
            open={open}
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
                        className="sm:flex relative shadow-2xl sm:overflow-hidden max-w-screen-2xl mx-auto bg-white">
                        <Dialog.Title className="sr-only">Login</Dialog.Title>
                        <div className="md:flex flex-col w-full relative h-screen md:h-auto">
                            <div className="flex flex-col md:flex-row max-w-screen-md2">
                                <a
                                    href="https://replicate.com/stability-ai/stable-diffusion?prediction=qffyxjvmbvfdbao7vvv2oss2gq"
                                    target="_blank"
                                    rel="noreferrer"
                                    title="multicolor hyperspace"
                                    className="bg-center mt-16 md:mt-0 w-full md:w-60 lg:w-96 h-44 md:h-96 bg-cover flex-shrink-0"
                                    style={{
                                        backgroundImage: `url(${image})`,
                                    }}>
                                    <span className="sr-only">
                                        multicolor hyperspace
                                    </span>
                                </a>
                                <div className="flex flex-col overflow-hidden">
                                    <div className="flex items-center justify-between w-full border-b p-4 gap-x-4 fixed md:static top-0 bg-white">
                                        <div className="flex gap-x-4 items-center">
                                            <div className="text-lg font-medium">
                                                Login
                                            </div>
                                        </div>
                                        <ModalCloseButton onClose={onClose} />
                                    </div>
                                    <div className="overflow-y-scroll md:flex flex-grow w-screen max-w-full md:pt-0 bg-gray-50 divide-x">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Dialog>
    );
};
