export type AvailableModels =
    | 'your-collection'
    | 'stability-ai/stable-diffusion'
    | 'methexis-inc/img2prompt'
    | 'tencentarc/gfpgan'
    | 'deforum/deforum_stable_diffusion';

export type ModelAttributes = {
    id: AvailableModels;
    name: string;
    description: string;
    active: boolean;
    hideFromList: boolean;
};

export type ImageLike = {
    alt?: string;
    caption?: string;
    id?: number;
    url?: string;
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
    latest_version?: { id?: string };
};

export type PredictionData = {
    completed_at?: Date;
    created_at?: Date;
    error?: string;
    metrics?: { predict_time?: number };
    output?: string[];
    status?: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
};
