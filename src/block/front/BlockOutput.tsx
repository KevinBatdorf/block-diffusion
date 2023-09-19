import { useBlockProps as blockProps } from '@wordpress/block-editor';
import { BlockAttributes as Attributes } from '../../types';
import './style.css';

type BlockOutputProps = {
    attributes: Attributes;
};
const allowList = [
    'id',
    'startingModel',
    'availableModels',
    'capabilityRestriction',
    'promptSuggestions',
];
export const BlockOutput = ({ attributes }: BlockOutputProps) => {
    const attributesAllowed = Object.fromEntries(
        Object.entries(attributes).filter(([key]) => allowList.includes(key)),
    );
    return (
        <div {...blockProps.save({ className: 'block-diffusion' })}>
            <div className="w-full p-4 bg-indigo-500 text-white">
                <div className="block-diffusion-output"></div>
                <form
                    className="block-diffusion-form"
                    data-attributes={JSON.stringify(attributesAllowed)}>
                    <textarea className="block-diffusion-prompt-textarea" />
                    <button className="block-diffusion-submit-button">
                        {/* TODO: make this configurable */}
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};
