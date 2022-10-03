import classNames from 'classnames';
import { makeUrlFriendly } from '../../utils';
import { PromptGenerator } from '../features/PromptGenerator';

type PromptSelectProps = {
    value: string;
    label: string;
    disabled: boolean;
    initialFocus?: React.RefObject<HTMLTextAreaElement>;
    onChange: (value: string) => void;
};
export const PromptInput = ({
    value,
    label,
    disabled,
    initialFocus,
    onChange,
}: PromptSelectProps) => {
    const formItemClass = classNames(
        'w-full text-lg rounded-none focus:outline-none focus:ring-wp ring-wp-theme-500 focus:shadow-none border pr-8',
        {
            'bg-gray-200 border-gray-200': disabled,
            'border-gray-900': !disabled,
        },
    );
    const id = `replicate-prompt-${makeUrlFriendly(label)}`;
    return (
        <div>
            <label
                htmlFor={id}
                className="text-base font-medium block mb-1 rin">
                {label}
            </label>
            <div className="relative">
                <textarea
                    ref={initialFocus}
                    className={formItemClass}
                    id={id}
                    value={value}
                    rows={4}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                />
                <PromptGenerator update={onChange} />
            </div>
        </div>
    );
};
