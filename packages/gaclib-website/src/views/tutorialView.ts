import { html, render } from 'lit-html';

export const viewExport = {
    renderView(model: { title: string }, target: Element): void {
        const htmlTemplate = html`
<script lang="javascript">
document.getElementById("navTutorial").classList.add("Selected");
</script>
Hello, navTutorial.
`;
        render(htmlTemplate, target);
    }
};
