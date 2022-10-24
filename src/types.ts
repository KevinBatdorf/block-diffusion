export type AvailableModels =
    | 'stability-ai/stable-diffusion'
    | 'lambdal/text-to-pokemon'
    | 'methexis-inc/img2prompt'
    | 'tencentarc/gfpgan'
    | 'deforum/deforum_stable_diffusion';

export type ModelAttributes = {
    id: AvailableModels;
    name: string;
    description: string;
    image: string;
};

export type ImageLike = {
    id: number | string;
    url: string;
    caption: string;
    alt?: string;
    linkDestination?: string;
    href?: string;
    rel?: string;
    linkTarget?: string;
    linkClass?: string;
};

export type WpImage = {
    id: number;
    source_url: string;
    mime_type: string;
    alt_text: string;
    link: string;
    media_details: {
        file: string;
        height: number;
        width: number;
    };
    caption: { raw: string };
    description: { raw: string };
    title: { raw: string };
    slug: string;
    status: string;
};

export type ModelData = {
    url?: string;
    description?: string;
    name?: string;
    owner?: string;
    visibility?: string;
    paper_url?: string;
    license_url?: string;
    github_url?: string;
    latest_version?: {
        id?: string;
        openapi_schema?: OpenApiSchema;
    };
};

export type PredictionData = {
    id: string;
    completed_at?: Date;
    created_at?: Date;
    error?: string;
    metrics?: { predict_time?: number };
    output?: string[];
    status?: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    input?: StableDiffusionInputs;
};

export type StableDiffusionInputs = {
    prompt: string;
    width: number;
    height: number;
};

export type PromptResponse = {
    prompt?: string;
    imageUrls?: string[];
};

export type InputsData = {
    prompt?: PromptInput;
    initImage?: InitImageInput;
    width?: WidthInput;
    height?: HeightInput;
    numOutputs?: NumOutputsInput;
};
export type PromptInput = {
    type: string;
    default: string;
    description: string;
    title: string;
};
export type InitImageInput = {
    type: string;
    format: string;
    description: string;
    title: string;
    default?: string;
};
export type WidthInput = {
    default?: number;
    description: string;
    enum: number[];
    title: string;
    type: string;
};
export type HeightInput = {
    default?: number;
    description: string;
    enum: number[];
    title: string;
    type: string;
};
export type NumOutputsInput = {
    default?: number;
    description: string;
    enum: number[];
    title: string;
    type: string;
};
export type OpenApiSchema = {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    components: {
        schemas: {
            Input: {
                properties: {
                    prompt?: PromptInput;
                    init_image?: InitImagePrompt;
                    width?: {
                        default: number;
                        description: string;
                        allOf: {
                            $ref: string;
                        }[];
                    };
                    height?: {
                        default: number;
                        description: string;
                        allOf: {
                            $ref: string;
                        }[];
                    };
                    num_outputs?: {
                        default: number;
                        description: string;
                        allOf: {
                            $ref: string;
                        }[];
                    };
                };
            };
            // TODO: update this type to depends on the input being present
            width?: WidthInput;
            height?: HeightInput;
            num_outputs?: NumOutputsInput;
        };
    };
};
