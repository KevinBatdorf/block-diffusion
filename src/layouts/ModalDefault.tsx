import { ModalControls } from '../components/ModalControls';

type ContentWrapperProps = {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
};
export const ModalDefault = ({
    children,
    title,
    onClose,
}: ContentWrapperProps) => {
    return (
        <>
            <ModalControls onClose={onClose} title={title} />
            <div className="overflow-y-scroll md:flex flex-grow w-screen max-w-full md:pt-0 bg-gray-50 divide-x h-screen lg:h-auto pt-16">
                {children}
            </div>
        </>
    );
};
