import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModalCloseButton } from '../components/ModalControls';

type ModalProps = {
    onClose: () => void;
    title: string;
    open: boolean;
    testingId?: string;
    children: React.ReactNode;
    initialFocus: React.RefObject<HTMLElement>;
    image: {
        url: string;
        href: string;
        title: string;
    };
};
export const DialogWithImageModal = ({
    title,
    onClose,
    open,
    testingId,
    initialFocus,
    image,
    children,
}: ModalProps) => {
    return (
        <Dialog
            className="stable-diffusion-editor stable-diffusion-modal"
            initialFocus={initialFocus}
            data-cy={testingId}
            open={open}
            onClose={onClose}>
            <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />
                <AnimatePresence>
                    <motion.div
                        key={`modal-${title}`}
                        initial={{ y: 5 }}
                        animate={{ y: 0 }}
                        exit={{ y: 0, opacity: 0 }}
                        className="sm:flex relative shadow-2xl max-w-screen-md2 mx-auto bg-white overflow-y-auto md:overflow-hidden h-screen md:h-auto flex-grow">
                        <Dialog.Title className="sr-only">{title}</Dialog.Title>
                        <div className="flex flex-col md:flex-row flex-grow w-full relative h-screen md:h-auto">
                            <a
                                href={image.href}
                                target="_blank"
                                rel="noreferrer"
                                title={image.title}
                                className="bg-center mt-12 md:mt-0 w-full md:w-60 lg:w-96 h-56 md:h-full bg-cover flex-shrink-0"
                                style={{
                                    backgroundImage: `url(${image.url})`,
                                }}>
                                <span className="sr-only">{image.title}</span>
                            </a>
                            <div className="flex flex-col md:overflow-x-hidden flex-grow">
                                <div className="flex items-center justify-between w-full border-b gap-x-4 bg-white h-10">
                                    <div className="font-mono font-semibold text-sm px-6">
                                        {title}
                                    </div>
                                    <ModalCloseButton onClose={onClose} />
                                </div>
                                <div className="flex flex-grow w-screen max-w-full flex-col space-y-4 p-6 bg-gray-50">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Dialog>
    );
};
