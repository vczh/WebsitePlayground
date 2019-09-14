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
    containerId?: string;
    htmlInfo: HtmlInfo;
}

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

interface ViewMap {
    [key: string]: ViewMetadata;
}

interface MvcView {
    targetObject?: string;
    viewName: string;
}

export function generateHtml(htmlInfo: HtmlInfo, views: ViewMetadata[], viewName: string, mvcModel: {}, head: string, body: string): string {
    const viewMap: ViewMap = {};
    for (const view of views) {
        viewMap[view.name] = view;
    }

    const mvcViews: MvcView[] = [];
    let currentViewName: string | undefined = viewName;
    while (currentViewName !== undefined) {
        const currentView: ViewMetadata = viewMap[currentViewName];
        if (currentView === undefined) {
            throw new Error(`Unable to find view: "${currentViewName}".`);
        }

        if (mvcViews.length > 0) {
            if (currentView.containerId === undefined) {
                throw new Error(`View "${currentView.name}" should have a container ID because it contains view "${mvcViews[0].viewName}".`);
            }
            mvcViews[0].targetObject = currentView.containerId;
        }

        mvcViews.unshift({ viewName: currentViewName });
        currentViewName = currentView.parentView;
    }

    let info: HtmlInfo = mergeHtmlInfo(
        {
            scripts: mvcViews.map((mvcView: MvcView) => viewMap[mvcView.viewName].path)
        },
        htmlInfo
    );
    for (const mvcView of mvcViews) {
        info = mergeHtmlInfo(info, viewMap[mvcView.viewName].htmlInfo);
    }

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
const mvcModel = ${JSON.stringify(mvcModel, undefined, 2)};
const mvcViews = ${JSON.stringify(mvcViews, undefined, 2)};
for(const view of mvcViews) {
  window[view.viewName].renderView(mvcModel, (view.targetObject === undefined ? document.body : document.getDocumentById(view.targetObject)));
}
</script>
${body}
</body>
</html>
`;
}
