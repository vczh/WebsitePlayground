import { html, render } from 'lit-html';

const buttons: [string, string, string][] = [
    ['Home', 'index', 'HOME'],
    ['Tutorial', 'tutorial', 'TUTORIAL'],
    ['Demo', 'demo', 'DEMOES'],
    ['Download', 'download', 'DOWNLOAD'],
    ['Document', 'document', 'DOCUMENT'],
    ['Contact', 'contact', 'CONTACT']
];

export const viewExport = {
    renderView(model: {}, target: Element): void {
        const htmlTemplate = html`
<table class="RootTable">
    <tr>
        <td align="center" valign="top">
            <table class="NavigateTable" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="NavigateHeader" colspan="6" align="left">
                        <img src="/logo.gif" />
                    </td>
                </tr>
                <tr>${
            buttons.map((button: [string, string, string]) => {
                const [htmlClass, htmlLink, htmlText] = button;
                return html`
                <td align="center" valign="middle">
                    <a id="nav${htmlClass}" class="MenuButton ${htmlClass}Button" href="/${htmlLink}.html">
                        ${htmlText}
                    </a>
                </td>
                `;
            })}
                </tr>
                <tr>
                    <td align="left" valign="top" colspan="6">
                        <div id="rootViewContainer"/>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<script lang="javascript">
document.getElementById("nav" + activeButton).classList.add("Selected");
</script>
`;
        render(htmlTemplate, target);
    }
};
