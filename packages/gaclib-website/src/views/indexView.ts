import { html, render } from 'lit-html';

export const viewExport = {
    renderView(model: { title: string }, target: Element): void {
        const htmlTemplate = html`
<script lang="javascript">
document.getElementById("navHome").classList.add("Selected");
</script>
Hello, <strong>${model.title}</strong>
`;
        render(htmlTemplate, target);
    }
};
