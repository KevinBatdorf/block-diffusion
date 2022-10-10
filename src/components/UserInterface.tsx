import apiFetch from '@wordpress/api-fetch';
import { Button } from '@wordpress/components';
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
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { useInputsState } from '../state/inputs';
import { useSettingsStore } from '../state/settings';
import {
    AvailableModels,
    HeightInput,
    ImageLike,
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
    const { width, height, prompt } = useInputsState();
    const { has } = useSettingsStore();
    const { apiToken } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [promptInputData, setPromptInputData] = useState<PromptInputs>({});
    const importButtonRef = useRef<HTMLButtonElement>(null);
    const focusArea = useRef<HTMLFormElement>(null);
    const [generateId, setGenerateId] = useState<string>('');
    const { data: generateData } = usePrediction(generateId);

    const processing = ['starting', 'processing'].includes(
        generateData?.status ?? '',
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
                input: { width, height, prompt, num_outputs: 4 },
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
        if (generateData?.error) setErrorMsg(generateData.error);
    }, [generateData?.error]);

    useEffect(() => {
        if (!processing || generateData?.status === 'failed') {
            setMaybeImporting(false);
        }
    }, [processing, setMaybeImporting, generateData?.status]);

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
            generateData?.status ? `${generateData?.status}...` : '',
        );
    }, [generateData, importingMessage]);

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
        });
    }, [modelInfo]);

    useLayoutEffect(() => {
        resetState();
    }, [promptInputData, width, height]);

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
                                disabled={maybeImporting}
                                importing={importingMessage.length > 0}
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
            <div className="bg-gray-50 flex h-full items-center justify-center overflow-y-scroll p-8 w-full">
                <AnimatePresence>
                    <MainPanel
                        setImage={setImage}
                        generateData={generateData}
                    />
                </AnimatePresence>
            </div>
        </>
    );
};

type MainPanelProps = {
    generateData?: PredictionData;
    setImage: (image: ImageLike) => void;
};
const MainPanel = ({ generateData, setImage }: MainPanelProps) => {
    const { width, height, prompt } = useInputsState();
    const { importingMessage } = useGlobalState();
    const canImport = generateData?.status === 'succeeded' && !importingMessage;

    const handleImport = () => {
        if (!generateData?.output?.length) return;
        setImage({
            url: generateData.output[0],
            id: generateData?.id,
            caption: generateData?.input?.prompt || prompt,
        });
    };

    if (canImport && generateData?.output?.length) {
        return (
            <motion.div
                key={generateData.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={classNames('gap-6 grid w-full self-start', {
                    'lg:grid-cols-2': generateData?.output?.length >= 2,
                })}>
                {generateData?.output?.map((url) => (
                    <div
                        key={url}
                        className="flex items-center justify-center bg-gray-100">
                        {/* todo: number UI */}
                        {/* todo: import button */}
                        {/* left slide out, copy to clipboard, import to wp, download,  */}
                        {/* <Button
                            onClick={handleImport}
                            type="button"
                            variant="primary">
                            {__('Import into editor', 'stable-diffusion')}
                        </Button> */}
                        <div
                            className="w-full bg-no-repeat bg-contain"
                            style={{
                                maxWidth: `${width}px`,
                                aspectRatio: `${width}/${height}`,
                                backgroundImage: `url(${url})`,
                            }}
                        />
                    </div>
                ))}
            </motion.div>
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
