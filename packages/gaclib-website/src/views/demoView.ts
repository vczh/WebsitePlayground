import { html, render } from 'lit-html';

export const viewExport = {
    renderView(model: { title: string }, target: Element): void {
        const htmlTemplate = html`
<script lang="javascript">
document.getElementById("navDemo").classList.add("Selected");
</script>
Hello, navDemo.
`;
        render(htmlTemplate, target);
    }
};
