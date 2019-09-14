import { HtmlInfo } from './interfaces';

export function mergeHtmlInfo(original: HtmlInfo, override: HtmlInfo): HtmlInfo {
    const info = { ...original };
    if (override.title !== undefined) {
        info.title = override.title;
    }
    if (override.shortcutIcon !== undefined) {
        info.shortcutIcon = override.shortcutIcon;
    }
    if (override.styleSheets !== undefined) {
        info.styleSheets =
            info.styleSheets === undefined ?
                override.styleSheets :
                info.styleSheets.concat(override.styleSheets);
    }
    if (override.scripts !== undefined) {
        info.scripts =
            info.scripts === undefined ?
                override.scripts :
                info.scripts.concat(override.scripts);
    }
    return info;
}

export function generateHtml(info: HtmlInfo, model: {}, head: string, body: string): string {
    return `<!DOCTYPE html>
<html>
<head>
<title>${info.title === undefined ? 'UNTITLED' : info.title}</title>
${info.shortcutIcon === undefined ? '' : `<link rel="shortcut icon" href="${info.shortcutIcon}" />`}
${info.styleSheets === undefined ? '' : info.styleSheets.map((value: string) => `<link rel="stylesheet" type="text/css" href="${value}" />`).join('\n')}
${info.scripts === undefined ? '' : info.scripts.map((value: string) => `<script src="${value}"></script>`).join('\n')}
${head}
</head>
<body>
<script lang="javascript">
window["Gaclib-Model"] = ${JSON.stringify(model, undefined, 2)};
</script>
${body}
</body>
</html>
`;
}

export * from './interfaces';
export { views } from './views';
