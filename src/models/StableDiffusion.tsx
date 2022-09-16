import apiFetch from '@wordpress/api-fetch';
import { Button } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { ModelCard } from '../components/ModelCard';
import { GoButton } from '../components/inputs/GoButton';
import { NumberSelect } from '../components/inputs/NumberSelect';
import { PromptInput } from '../components/inputs/PromptInput';
import { useModel } from '../hooks/useModel';
import { usePrediction } from '../hooks/usePrediction';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { ImageLike } from '../types';

type StableDiffusionProps = {
    setImage: (image: ImageLike) => void;
    initialFocus: React.RefObject<HTMLTextAreaElement>;
};

type GenerateResponse = { id: string; error: string };

export const StableDiffusion = ({
    setImage,
    initialFocus,
}: StableDiffusionProps) => {
    const { data: modelInfo } = useModel('stability-ai/stable-diffusion');
    const { importingMessage, setMaybeImporting, maybeImporting } =
        useGlobalState();
    const { apiToken } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [prompt, setPrompt] = useState('');
    const [width, setWidth] = useState(768);
    const [height, setHeight] = useState(512);
    const importButtonRef = useRef<HTMLButtonElement>(null);
    const [generateId, setGenerateId] = useState<string>('');
    const { data: generateData } = usePrediction(generateId);

    const processing = ['starting', 'processing'].includes(
        generateData?.status ?? '',
    );
    const canImport = generateData?.status === 'succeeded' && !importingMessage;

    const imageOutput = {
        maxWidth: `${width}px`,
        maxHeight: 'calc(100% - 2.5rem)',
        aspectRatio: `${width}/${height}`,
        backgroundImage: generateData?.output?.length
            ? `url(${generateData?.output?.[0]})`
            : undefined,
    };

    const handleSubmit = async () => {
        setErrorMsg('');
        setGenerateId('');
        if (!prompt) {
            setErrorMsg(__('Please enter a prompt', 'stable-diffusion'));
            return;
        }
        if (!modelInfo?.latest_version?.id) {
            setErrorMsg(
                __(
                    'Model version not found. Please open a support ticket.',
                    'stable-diffusion',
                ),
            );
            return;
        }
        setMaybeImporting(true);
        const response = await apiFetch<GenerateResponse>({
            path: `kevinbatdorf/stable-diffusion/generate?cache=${Date.now()}`,
            method: 'POST',
            headers: { Authorization: `Token ${apiToken}` },
            data: {
                input: { width, height, prompt },
                version: modelInfo.latest_version.id,
            },
        }).catch((error) => {
            if (error.detail) {
                setErrorMsg(error.detail);
            }
        });
        if (response?.error) {
            setMaybeImporting(false);
            setErrorMsg(response.error);
            return;
        }
        if (response?.id) setGenerateId(response.id);
    };

    const handleCancel = () =>
        apiFetch({
            path: 'kevinbatdorf/stable-diffusion/cancel',
            method: 'POST',
            headers: { Authorization: `Token ${apiToken}` },
            data: { id: generateId },
        });

    const handleImport = () => {
        if (!generateData?.output?.length) return;
        setImage({
            url: generateData.output[0],
            id: generateData?.id || generateId,
            caption: generateData?.input?.prompt || prompt,
        });
    };

    useEffect(() => {
        if (generateData?.error) setErrorMsg(generateData.error);
    }, [generateData?.error]);

    useEffect(() => {
        if (!processing) setMaybeImporting(false);
    }, [processing, setMaybeImporting]);

    useEffect(() => {
        setGenerateId('');
    }, [width, height]);

    useEffect(() => {
        if (generateData?.status === 'succeeded') {
            importButtonRef.current?.focus();
        }
    }, [generateData?.status]);

    useEffect(() => {
        if (importingMessage) return;
        if (generateData?.metrics?.predict_time) {
            const time = sprintf(
                __('Billed time: %s', 'stable-diffusion'),
                generateData.metrics.predict_time,
            );
            setStatusMessage(time);
            return;
        }
        setStatusMessage(
            generateData?.status
                ? `${generateData?.status}...`
                : __('Enter a prompt to begin', 'stable-diffusion'),
        );
    }, [generateData, importingMessage]);

    useEffect(() => {
        if (importingMessage) setStatusMessage(importingMessage);
    }, [importingMessage]);

    return (
        <>
            <div className="flex flex-col justify-between md:w-96 flex-shrink-0 overflow-y-scroll bg-white">
                <form
                    className="flex flex-col gap-y-4 flex-shrink-0 p-8 flex-grow"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    <PromptInput
                        initialFocus={initialFocus}
                        value={prompt}
                        onChange={setPrompt}
                        disabled={processing}
                        label={__('Prompt', 'stable-diffusion')}
                    />
                    <div className="flex gap-x-4">
                        <NumberSelect
                            label={__('Width', 'stable-diffusion')}
                            value={width}
                            disabled={processing}
                            onChange={setWidth}
                            options={[128, 256, 512, 768, 1024]}
                        />
                        <NumberSelect
                            label={__('Height', 'stable-diffusion')}
                            value={height}
                            disabled={processing}
                            onChange={setHeight}
                            options={[128, 256, 512, 768, 1024]}
                        />
                    </div>
                    <div className="flex justify-end mt-4 gap-x-2">
                        <AnimatePresence>
                            <GoButton
                                disabled={maybeImporting}
                                importing={importingMessage.length > 0}
                                processing={processing}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />
                        </AnimatePresence>
                    </div>
                    <p
                        className="text-red-500 m-0"
                        style={{ minHeight: '20px' }}>
                        {errorMsg}
                    </p>
                </form>
                <AnimatePresence>
                    <ModelCard modelInfo={modelInfo} />
                </AnimatePresence>
            </div>
            <div className="w-full h-full overflow-hidden p-8 bg-gray-50">
                <AnimatePresence>
                    <div className="mb-2 -mt-4 h-10 w-full">
                        {statusMessage && (
                            <motion.div
                                className={classNames(
                                    'h-full flex items-center',
                                    {
                                        'justify-between': canImport,
                                        'justify-center': !canImport,
                                    },
                                )}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}>
                                <motion.span
                                    className="font-mono"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}>
                                    {statusMessage}
                                </motion.span>
                                {canImport && (
                                    <Button
                                        ref={importButtonRef}
                                        onClick={handleImport}
                                        type="button"
                                        variant="primary">
                                        {__(
                                            'Import into editor',
                                            'stable-diffusion',
                                        )}
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
                <motion.div
                    role="button"
                    onClick={() => {
                        initialFocus?.current?.focus();
                    }}
                    transition={{ type: 'Tween' }}
                    className="border border-gray-500 flex items-center justify-center bg-cover mx-auto"
                    animate={imageOutput}
                    initial={imageOutput}
                />
            </div>
        </>
    );
};
