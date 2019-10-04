import { html, render } from 'lit-html';

export const viewExport = {
    renderView(model: {}, target: Element): void {
        const htmlTemplate = html`
<pre id="article"></pre>
<script lang="javascript">
document.getElementById("article").innerText = JSON.stringify(article, null, 2);
</script>
`;
        render(htmlTemplate, target);
    }
};
