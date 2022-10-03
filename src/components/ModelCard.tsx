import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { ModelData } from '../types';

type ModelCardProps = {
    modelInfo?: ModelData;
};
export const ModelCard = ({ modelInfo }: ModelCardProps) => {
    if (!modelInfo) {
        return null;
    }
    return (
        <div className="flex items-end" style={{ minHeight: '250px' }}>
            <motion.div
                className="p-6 pt-0 pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                <ModelMetadata {...modelInfo} />
            </motion.div>
        </div>
    );
};

const ModelMetadata = ({
    url,
    description,
    name,
    owner,
    paper_url,
    license_url,
    github_url,
}: ModelData) => (
    <div className="bg-gray-100 p-4 group flex flex-col gap-2 transform-gpu">
        <div>
            {(owner || name) && (
                <div className="font-medium font-mono mb-2">
                    {owner} / {name}
                </div>
            )}
            {description && <p className="m-0 leading-tight">{description}</p>}
        </div>

        {(url || paper_url || license_url || github_url) && (
            <div className="h-0 group-hover:h-10 transition-all duration-500 overflow-hidden">
                <div className="flex gap-x-2">
                    {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {__('Model', 'stable-diffusion')}
                        </a>
                    )}
                    {paper_url && (
                        <a
                            href={paper_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            {__('Paper', 'stable-diffusion')}
                        </a>
                    )}
                    {license_url && (
                        <a
                            href={license_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            {__('License', 'stable-diffusion')}
                        </a>
                    )}
                    {github_url && (
                        <a
                            href={github_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            {__('GitHub', 'stable-diffusion')}
                        </a>
                    )}
                </div>
                <p className="text-xs italic m-0 mt-2">
                    {__('Links open in a new tab', 'stable-diffusion')}
                </p>
            </div>
        )}
    </div>
);
