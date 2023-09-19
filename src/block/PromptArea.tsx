import { useEffect } from '@wordpress/element';
import { BlockAttributes as Attributes } from '../types';
import { BlockOutput } from './front/BlockOutput';

type PromptAreaProps = {
    attributes: Attributes;
    clientId: string;
    setAttributes: (attributes: Partial<Attributes>) => void;
};

export const PromptArea = ({
    attributes,
    setAttributes,
    clientId,
}: PromptAreaProps) => {
    useEffect(() => {
        if (attributes.id === undefined) {
            setAttributes({ id: clientId });
        }
    }, [attributes.id, clientId, setAttributes]);
    return <BlockOutput {...{ attributes }} />;
};
