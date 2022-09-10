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
