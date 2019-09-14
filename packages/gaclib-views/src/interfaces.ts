export interface HtmlInfo {
    title?: string;
    shortcutIcon?: string;
    styleSheets?: string[];
    scripts?: string[];
}

export interface ViewMetadata {
    name: string;
    source: string;
    path: string;
    parentView?: string;
    htmlInfo: HtmlInfo;
}
