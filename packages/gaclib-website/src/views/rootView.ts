import { html, render } from 'lit-html';

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
                <tr>
                    <td align="center" valign="middle">
                        <a id="navHome" class="MenuButton HomeButton" href="/index.html">
                            HOME
                        </a>
                    </td>
                    <td align="center" valign="middle">
                        <a id="navTutorial" class="MenuButton TutorialButton" href="/tutorial.html">
                            TUTORIAL
                        </a>
                    </td>
                    <td align="center" valign="middle">
                        <a id="navDemo" class="MenuButton DemoButton" href="/demo.html">
                            DEMOES
                        </a>
                    </td>
                    <td align="center" valign="middle">
                        <a id="navDownload" class="MenuButton DownloadButton" href="/download.html">
                            DOWNLOAD
                        </a>
                    </td>
                    <td align="center" valign="middle">
                        <a id="navDocument" class="MenuButton DocumentButton" href="./document.html">
                            DOCUMENT
                        </a>
                    </td>
                    <td align="center" valign="middle">
                        <a id="navContact" class="MenuButton ContactButton" href="/contact.html">
                            CONTACT
                        </a>
                    </td>
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
`;
        render(htmlTemplate, target);
    }
};
