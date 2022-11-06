import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useModel } from '../hooks/useModel';
import { usePrediction } from '../hooks/usePrediction';
import { downloadImage, copyImage } from '../lib/image';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { useInputsState } from '../state/inputs';
import { useSettingsStore } from '../state/settings';
import {
    AvailableModels,
    HeightInput,
    ImageLike,
    NumOutputsInput,
    PredictionData,
    PromptInputs,
    WidthInput,
} from '../types';
import { InputGenerator } from './InputGenerator';
import { ModelCard } from './ModelCard';
import { GoButton } from './inputs/GoButton';
import { FocusHelperButton } from './misc/FocusHelperButton';

type StableDiffusionProps = {
    setImage: (image: ImageLike) => void;
    modelName: AvailableModels;
    initialFocus?: React.RefObject<HTMLButtonElement>;
};

type GenerateResponse = { id: string; error: string };

export const UserInferface = ({
    setImage,
    modelName,
    initialFocus,
}: StableDiffusionProps) => {
    const { data: modelInfo } = useModel(modelName);
    const { importingMessage, setMaybeImporting, maybeImporting } =
        useGlobalState();
    const { width, height, prompt, numOutputs: num_outputs } = useInputsState();
    const { has } = useSettingsStore();
    const { apiToken } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [promptInputData, setPromptInputData] = useState<PromptInputs>({});
    const importButtonRef = useRef<HTMLButtonElement>(null);
    const focusArea = useRef<HTMLFormElement>(null);
    const [generateId, setGenerateId] = useState<string>('');
    const { data: prediction } = usePrediction(generateId);

    const processing = ['starting', 'processing'].includes(
        prediction?.status ?? '',
    );

    const focusFirstItem = () => {
        const selector = focusArea?.current?.querySelector(
            'input, textarea, select',
        ) as HTMLElement;
        selector?.focus();
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
                input: { width, height, prompt, num_outputs },
                version: modelInfo.latest_version.id,
                webhook_completed: has('optIns', 'prompt-share')
                    ? 'https://www.block-diffusion.com/api/v1/replicate'
                    : undefined,
            },
        }).catch((error) => {
            if (error.detail) {
                setMaybeImporting(false);
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

    const resetState = () => {
        setErrorMsg('');
        setGenerateId('');
    };

    const handleCancel = () =>
        apiFetch({
            path: 'kevinbatdorf/stable-diffusion/cancel',
            method: 'POST',
            headers: { Authorization: `Token ${apiToken}` },
            data: { id: generateId },
        });

    useEffect(() => {
        if (prediction?.error) setErrorMsg(prediction.error);
    }, [prediction?.error]);

    useEffect(() => {
        if (!processing || prediction?.status === 'failed') {
            setMaybeImporting(false);
        }
    }, [processing, setMaybeImporting, prediction?.status]);

    useEffect(() => {
        if (prediction?.status === 'succeeded') {
            importButtonRef.current?.focus();
        }
    }, [prediction?.status]);

    useEffect(() => {
        if (importingMessage) return;
        if (prediction?.metrics?.predict_time) {
            const time = sprintf(
                __('Billed time: %s', 'stable-diffusion'),
                prediction.metrics.predict_time,
            );
            setStatusMessage(time);
            return;
        }
        setStatusMessage(prediction?.status ? `${prediction?.status}...` : '');
    }, [prediction, importingMessage]);

    useEffect(() => {
        if (importingMessage) setStatusMessage(importingMessage);
    }, [importingMessage]);

    useEffect(() => {
        const schema = modelInfo?.latest_version?.openapi_schema;
        if (!schema) return;
        const inputs = schema.components.schemas.Input.properties;
        // TODO: These could probably be more dynamic but lets do that when
        // the time comes to add support from a model
        const maybeWidth = inputs?.width
            ? schema.components.schemas.width
            : undefined;
        const maybeHeight = inputs?.height
            ? schema.components.schemas.height
            : undefined;
        const maybeNumOutputs = inputs?.num_outputs
            ? schema.components.schemas.num_outputs
            : undefined;
        setPromptInputData({
            prompt: inputs?.prompt,
            width: maybeWidth
                ? {
                      ...(maybeWidth as WidthInput),
                      default: inputs?.width?.default,
                  }
                : undefined,
            height: maybeHeight
                ? {
                      ...(maybeHeight as HeightInput),
                      default: inputs?.height?.default,
                  }
                : undefined,
            numOutputs: maybeNumOutputs
                ? {
                      ...(maybeNumOutputs as NumOutputsInput),
                      default: inputs?.num_outputs?.default,
                  }
                : undefined,
        });
    }, [modelInfo]);

    useLayoutEffect(() => {
        resetState();
    }, [promptInputData, width, height, num_outputs]);

    useEffect(() => {
        focusFirstItem();
    }, [promptInputData]);

    if (!modelInfo) {
        return (
            <div className="flex items-center justify-center w-full">
                <FocusHelperButton initialFocus={initialFocus} />
                <Spinner />
            </div>
        );
    }

    if (!Object.keys(promptInputData).length) {
        return (
            <div className="flex items-center justify-center w-full">
                {__(
                    'Model version not found. Please open a support ticket.',
                    'stable-diffusion',
                )}
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col justify-between md:w-96 flex-shrink-0 overflow-y-scroll bg-white">
                <form
                    ref={focusArea}
                    className="flex flex-col gap-y-6 flex-shrink-0 p-6 pb-0 flex-grow"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    {promptInputData && (
                        <InputGenerator
                            promptInputData={promptInputData}
                            disabled={processing}
                        />
                    )}
                    <div>
                        <AnimatePresence>
                            <GoButton
                                disabled={
                                    maybeImporting ||
                                    importingMessage?.length > 0
                                }
                                importing={
                                    importingMessage ===
                                    __('Importing...', 'stable-diffusion')
                                }
                                processing={processing}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />
                        </AnimatePresence>
                        <div className="m-0 my-2" style={{ minHeight: '20px' }}>
                            <AnimatePresence>
                                <StatusMessage
                                    errorMessage={errorMsg}
                                    message={statusMessage}
                                />
                            </AnimatePresence>
                        </div>
                    </div>
                </form>
                <AnimatePresence>
                    <ModelCard modelInfo={modelInfo} />
                </AnimatePresence>
            </div>
            <div className="bg-gray-50 flex flex-col h-full items-center overflow-y-scroll p-6 w-full relative">
                <AnimatePresence>
                    <MainPanel setImage={setImage} prediction={prediction} />
                </AnimatePresence>
            </div>
        </>
    );
};

type MainPanelProps = {
    prediction?: PredictionData;
    setImage: (image: ImageLike) => void;
};
const MainPanel = ({ prediction, setImage }: MainPanelProps) => {
    const { width, height, prompt } = useInputsState();
    const { id, output, input } = prediction || {};
    const { importingMessage } = useGlobalState();

    if (prediction?.status === 'succeeded' && output?.length) {
        return (
            <div
                className={classNames(
                    'flex flex-col h-full w-full items-center',
                    {
                        'pointer-events-none': importingMessage.length > 0,
                    },
                )}>
                {output?.length > 1 && (
                    <p className="font-mono m-0 mb-4 text-center">
                        {__(
                            'Hover over an image for options',
                            'stable-diffusion',
                        )}
                    </p>
                )}
                <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={classNames('gap-6 grid w-full self-start', {
                        'lg:grid-cols-2': output?.length >= 2,
                    })}>
                    {prediction?.output?.map((url, i) => (
                        <div
                            key={url}
                            className={classNames(
                                'flex items-center justify-center group',
                                {
                                    'relative bg-gray-100':
                                        output?.length !== 1,
                                },
                            )}>
                            <div
                                className={classNames(
                                    'w-full bg-no-repeat bg-contain',
                                    {
                                        '': output?.length === 1,
                                    },
                                )}
                                style={{
                                    maxWidth: `${width}px`,
                                    aspectRatio: `${width}/${height}`,
                                    backgroundImage: `url(${url})`,
                                }}>
                                <ImageActions
                                    id={`${id}-image-${i}`}
                                    url={url}
                                    caption={input?.prompt || prompt}
                                    setImage={setImage}
                                    forceShowHud={output?.length === 1}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        );
    }
    const imageOutput = {
        maxWidth: `${width}px`,
        maxHeight: 'calc(100% - 2.5rem)',
        aspectRatio: `${width}/${height}`,
    };
    return (
        <motion.div
            key="canvas-placeholder"
            role="button"
            transition={{ type: 'Tween' }}
            className="border border-gray-500 flex items-center justify-center bg-cover m-auto"
            animate={imageOutput}
            initial={imageOutput}>
            <div className="w-screen" />
        </motion.div>
    );
};

type ActionProps = {
    id: string;
    url: string;
    caption: string;
    forceShowHud?: boolean;
    setImage: (image: ImageLike) => void;
};
const ImageActions = ({
    setImage,
    id,
    url,
    caption,
    forceShowHud,
}: ActionProps) => {
    const btnClass =
        'bg-gray-900 text-white p-2 px-4 text-left outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 cursor-pointer hover:bg-wp-theme-500 transition-all duration-200';
    const { setImportingMessage } = useGlobalState();
    const handleImport = () => {
        if (!id) return;
        setImage({ id, url, caption });
    };
    const handleDownload = async () => {
        await downloadImage(url, `block-diffusion-${id}`);
    };
    const handleCopy = async () => {
        setImportingMessage(__('Copying...', 'stable-diffusion'));
        await copyImage(url);
        setImportingMessage('');
    };
    return (
        <div
            className={classNames(
                'absolute top-0 left-0 flex flex-col items-start gap-1 pt-1 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300',
                {
                    'lg:opacity-0': !forceShowHud,
                },
            )}
            style={{
                background:
                    'radial-gradient(100% 65px at left top, rgb(255 255 255 / 65%) 0px, rgb(0 0 0 / 0%))',
            }}>
            <button className={btnClass} onClick={handleImport} type="button">
                {__('Import into editor', 'stable-diffusion')}
            </button>
            <button className={btnClass} onClick={handleDownload} type="button">
                {__('Download', 'stable-diffusion')}
            </button>
            <button className={btnClass} onClick={handleCopy} type="button">
                {__('Copy', 'stable-diffusion')}
            </button>
        </div>
    );
};

type StatusMessageProps = {
    message: string;
    errorMessage: string;
};
const StatusMessage = ({ message, errorMessage }: StatusMessageProps) => {
    if (!errorMessage && !message) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.span
                className={classNames('font-mono', {
                    'text-red-500': errorMessage,
                })}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                {errorMessage || message}
            </motion.span>
        </motion.div>
    );
};
