import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useInputsState } from '../state/inputs';
import { InputsData } from '../types';
import { ImageUploader } from './inputs/ImageUploader';
import { MediaUploader } from './inputs/MediaUploader';
import { NumberSelect } from './inputs/NumberSelect';
import { PromptInput } from './inputs/PromptInput';

type Props = {
    inputsData: InputsData;
    disabled: boolean;
};
export const InputGenerator = ({ inputsData, disabled }: Props) => {
    const { width, height, prompt, numOutputs, setInput } = useInputsState();

    useEffect(() => {
        setInput('width', inputsData?.width?.default ?? 512);
        setInput('height', inputsData?.height?.default ?? 512);
        // setInput('prompt', inputsData?.prompt?.default ?? '');
    }, [inputsData, setInput]);

    return (
        <div className="flex flex-col gap-y-4">
            {inputsData?.prompt && (
                <PromptInput
                    value={prompt}
                    onChange={(v) => setInput('prompt', v)}
                    disabled={disabled}
                    label={__('Text prompt', 'stable-diffusion')}
                />
            )}
            {inputsData?.initImage && (
                <div>
                    <p className="m-0 mb-2 text-base font-medium">
                        {__('Starting image', 'stable-diffusion')}
                    </p>
                    <div className="flex gap-2">
                        <ImageUploader disabled={disabled} />
                        <MediaUploader disabled={disabled} />
                    </div>
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
                {inputsData?.width && (
                    <NumberSelect
                        label={__('Width', 'stable-diffusion')}
                        value={width}
                        disabled={disabled}
                        onChange={(v) => setInput('width', v)}
                        options={
                            inputsData?.width?.enum ?? [
                                128, 256, 512, 768, 1024,
                            ]
                        }
                    />
                )}
                {inputsData?.height && (
                    <NumberSelect
                        label={__('Height', 'stable-diffusion')}
                        value={height}
                        disabled={disabled}
                        onChange={(v) => setInput('height', v)}
                        options={
                            inputsData?.height?.enum ?? [
                                128, 256, 512, 768, 1024,
                            ]
                        }
                    />
                )}
                {inputsData?.numOutputs?.maximum && (
                    <NumberSelect
                        label={__('Number of outputs', 'stable-diffusion')}
                        value={numOutputs}
                        disabled={disabled}
                        onChange={(v) => setInput('numOutputs', v)}
                        options={Array.from(
                            {
                                length:
                                    inputsData?.numOutputs?.maximum -
                                    inputsData?.numOutputs?.minimum +
                                    1,
                            },
                            (_, i) => i + 1,
                        )}
                    />
                )}
            </div>
        </div>
    );
};
