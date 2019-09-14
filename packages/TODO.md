# TODO

- create `gaclib-render` package
  - Move code from `gaclib-view` except actual views
  - Provide a function for creating  webpack exported array
  - Provide a function for generating cascading views in HTML
- create `gaclib-host`
  - Text file registration to `Router<[string, (string | Buffer)]>`
  - binary file registration to `Router<[string, (string | Buffer)]>`
  - Accept `Router<[string, (string | Buffer)]>` and host a website
- rename `gaclib-views` to `gaclb-website`
  - `gaclib-website` contains
    - views
    - assest
    - `index.ts` to call `gaclib-host`

```html
<body>
<!-- This part is filled in server -->
<script lang="javascript">
window["MVC-UrlModel"] = {...};
window["MVC-Views"] = [
  {
    // null -> document.body, string -> document.getElementById
    // obtained from parentView.containerId (add this property)
    targetObject: null,

    // window["Gaclib-IndexView"].renderView(window["MVC-UrlModel"], document.getDocumentById(targetObject))
    viewName: "Gaclib-IndexView"
  }, ...
];
</script>

<!-- This part is hard coded if this page is enabled with views -->
<script lang="javascript">
for(const view of window["MVC-Views"]) {
    const model = window["MVC-UrlModel"];
    const target = view.targetObject === null ? document.body : document.getDocumentById(view.targetObject);
    window[view.viewName].renderView(model, target);
}
</script>
</body>
```
