import { BaseControl, FormTokenField } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { BlockAttributes as Attributes } from '../../../types';
import { useCapabilities } from '../../hooks/useCapabilities';

type AMProps = {
    attributes: Attributes;
    setAttributes: (attributes: Partial<Attributes>) => void;
};

export const AccessManager = ({ attributes, setAttributes }: AMProps) => {
    const { capabilities, loading: capsLoading } = useCapabilities();
    const { capabilityRestriction } = attributes;

    const canUpdate = useSelect((select) => {
        const { canUser } = select(coreStore);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore-next-line - canUser not added as a type?
        return canUser?.('update', 'settings') ?? false;
    }, []);

    const rolesWithAccess = useMemo(
        () =>
            capabilityRestriction?.reduce((acc, cap) => {
                capabilities?.[cap]?.forEach((role) => acc.add(role));
                return acc;
            }, new Set<string>()),
        [capabilityRestriction, capabilities],
    );

    return (
        <BaseControl id="stable-diffusion-permission">
            <>
                <FormTokenField
                    label={__('Permissions', 'stable-diffusion')}
                    tokenizeOnSpace={true}
                    __experimentalValidateInput={(value) =>
                        Object.keys(capabilities).includes(value)
                    }
                    __experimentalShowHowTo={false}
                    __experimentalExpandOnFocus={true}
                    value={capabilityRestriction}
                    suggestions={Object.keys(capabilities ?? {})}
                    onChange={(value) => {
                        if (!canUpdate) return;
                        const capabilityRestriction = value.map((s) =>
                            typeof s === 'string' ? s : s.value,
                        );
                        setAttributes({ capabilityRestriction });
                    }}
                />
                <p>
                    {__(
                        'Restrict access based on WordPress capabilities. Use `manage_options` to restrict access to admins only',
                        'stable-diffusion',
                    )}
                </p>

                {canUpdate ? null : (
                    <p className="text-wp-alert-red">
                        {__(
                            'You do not have permission to update this setting.',
                            'stable-diffusion',
                        )}
                    </p>
                )}
                {canUpdate && !capsLoading && (
                    <>
                        <div>
                            {__('Roles with access:', 'stable-diffusion')}
                        </div>
                        <ul className="ml-4 list-disc">
                            {rolesWithAccess?.size ? (
                                [...rolesWithAccess].map((role) => (
                                    <li key={role}>{role}</li>
                                ))
                            ) : (
                                <li>{__('No one', 'stable-diffusion')}</li>
                            )}
                        </ul>
                    </>
                )}
            </>
        </BaseControl>
    );
};
