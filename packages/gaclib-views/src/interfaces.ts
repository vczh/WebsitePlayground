export interface HtmlInfo {
    title?: string;
    shortcutIcon?: string;
    styleSheets?: string[];
    scripts?: string[];
}

export interface ViewMetadata {
    name: string;
    path: string;
    parentView?: string;
    htmlInfo?: HtmlInfo;
}
