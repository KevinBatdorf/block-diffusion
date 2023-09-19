import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ModalControls } from '../../../components/ModalControls';
import { useAuth } from '../hooks/useAuth';
import { useGlobalState } from '../state/global';

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
    const { loggingIn, error, mutate } = useAuth();
    const { imageBlockId } = useGlobalState();

    useEffect(() => {
        if (!imageBlockId) {
            return () => {
                mutate(undefined, { revalidate: false });
            };
        }
    }, [mutate, imageBlockId]);

    return (
        <>
            <ModalControls
                hide={loggingIn || error}
                onClose={onClose}
                title={title}
            />
            <div className="overflow-y-auto md:flex flex-grow w-screen max-w-full md:pt-0 bg-gray-50 divide-x h-screen lg:h-auto pt-16">
                {loggingIn ? (
                    <div className="flex flex-grow justify-center items-center w-full h-full">
                        {__('Checking access...', 'stable-diffusion')}
                    </div>
                ) : (
                    <Content error={error}>{children}</Content>
                )}
            </div>
        </>
    );
};

const Content = ({
    children,
    error,
}: {
    children: React.ReactNode;
    error?: string;
}): JSX.Element => {
    if (error) {
        return (
            <div className="flex items-center justify-center w-full h-full font-mono">
                {error}
            </div>
        );
    }
    return <>{children}</>;
};
