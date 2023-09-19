import {
    BaseControl,
    FormTokenField,
    ExternalLink,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockAttributes as Attributes } from '../../../types';
import { useModels } from '../../hooks/useModels';
import { useSuggestions } from '../../state/suggestions';

type ModelManagerProps = {
    attributes: Attributes;
    setAttributes: (attributes: Partial<Attributes>) => void;
};

export const ModelManager = ({
    attributes,
    setAttributes,
}: ModelManagerProps) => {
    const { models } = useModels();
    const { availableModels } = attributes;

    return (
        <>
            <BaseControl id="stable-diffusion-models">
                <>
                    <FormTokenField
                        label={__('Allowed Models', 'stable-diffusion')}
                        tokenizeOnSpace={true}
                        __experimentalValidateInput={(value) =>
                            models?.includes(value) ?? false
                        }
                        __experimentalShowHowTo={false}
                        __experimentalExpandOnFocus={true}
                        value={availableModels}
                        suggestions={models ?? []}
                        onChange={(value) => {
                            const availableModels = value.map((s) =>
                                typeof s === 'string' ? s : s.value,
                            );
                            setAttributes({ availableModels });
                        }}
                    />
                    <p>
                        {__(
                            'Select which models you want to include. (Support for additional models coming soon!)',
                            'stable-diffusion',
                        )}
                    </p>
                    <ExternalLink href="https://github.com/sponsors/KevinBatdorf">
                        {__(
                            'Sponsor development for $1 a month',
                            'stable-diffusion',
                        )}
                    </ExternalLink>
                </>
            </BaseControl>
            <ModelSuggestions {...{ attributes, setAttributes }} />
        </>
    );
};

const ModelSuggestions = ({ attributes, setAttributes }: ModelManagerProps) => {
    const { prompts, has } = useSuggestions();
    const { promptSuggestions } = attributes;

    const handleOpenModal = () => {
        window.dispatchEvent(
            new CustomEvent('stable-diffusion-open-suggestions-modal'),
        );
    };
    return (
        <BaseControl id="stable-diffusion-model-suggestions">
            <FormTokenField
                label={__('Prompt Suggestions', 'stable-diffusion')}
                tokenizeOnSpace={true}
                __experimentalValidateInput={(value) => has(value) ?? false}
                __experimentalShowHowTo={false}
                __experimentalExpandOnFocus={true}
                value={promptSuggestions.map(({ label }) => label)}
                suggestions={prompts.map(({ label }) => label)}
                onChange={(value) => {
                    const promptSuggestions = value
                        .map((s) => {
                            const v = typeof s === 'string' ? s : s.value;
                            return prompts.find(({ label }) => label === v);
                        })
                        .filter(Boolean) as typeof prompts;
                    setAttributes({ promptSuggestions });
                }}
            />
            <button
                type="button"
                className="bg-transparent m-0 mb-2 p-0 border-0 text-wp-theme-500 underline text-xs"
                onClick={handleOpenModal}>
                {__('Manage Suggestions List', 'stable-diffusion')}
            </button>
            <p>
                {__(
                    'If the model has a text prompt, you can add suggestions here.',
                    'stable-diffusion',
                )}
            </p>
        </BaseControl>
    );
};
