# TODO

- XML format artical that supports
  - Create a `articleView.ts`
  - XML will be load during `router.register` as a embedded resource in config
  - `articleView.ts` will find the resource with a specific name and render to html
  - `https://www.npmjs.com/package/xml-js`

```xml
<article index="true" numberBeforeTitle="true">
    <topic anchor="Name to use in 'a' element">
        <title>This is automatically a H1 title</title>
        <p>H1 title is the title of the article, numberBeforeTitle does not apply.</p>
        <p>paragraph</p>
        <p>Valid elements inside topic is, a single title, multiple pargraphcs and multiple topics</p>
        <topic>
            <title>H2</title>
            <p>numberBeforeTitle applies here and gives 1.xxx</p>
            <topic>
                <title>H3</title>
                <p>Becomes 1.1 H3</p>
            </topic>
            <topic>
                <title>H3</title>
                <p>Becomes 1.2 H3</p>
            </topic>
        </topic>
        <topic>
            <title>Regardless where a title is placed, it is always moved to the first</title>
            <p>numberBeforeTitle applies here and gives 2.xxx</p>
        </topic>
    </topic>
</article>
```

- Valid inside `<p/>`
  - Implement `symbol` after document is ready
  - Implement `program`'s after document is ready
    - For now only convert to HTML but no colorize and validate

```xml
<a href="./document.html">Text</a>
<a anchor="Anchor">
  If there is no text then the title is copied here.
  If Anchor cannot be found, then it will search all topic and convert non-letter continuous characters to '-', and compare it with Anchor, case insensitive
    e.g. "This is my car's color" -> "#this-is-my-car-s-color"
</a>
<symbol name="C++:vl.presentation.controls.GuiControl">C++ could be omitted because it is the default value. Other values could be Workflow</symbol>
<symbol>IncompleteClassOrFunctionName, C++ only</symbol>
<name>Just like `` in md</name>
<img src="logo.png"/>Description</img>
<ul><li>...</li></ul>
<ol><li>...</li></ol>
<b>translate to strong</b>
<em>translate to em</em>
<program project="vlpp" language="C++">
    <code>
        <![CDATA[translated to <pre><code>]]>
    </code>
    <output>
        <!--This will be automatically validated-->
        <![CDATA[translated to <pre><samp>]]>
    </output>
</program>
```

- `litHtmlViewCallback` is not strongly typed
  - Make it strongly typed
  - Allow calculating some embedded resources from mvcModel's value

## Home page

- Summary of showcase, click and jump to below
- Introduction to Vlpp, VlppOS, VlppParser, VlppReflection, VlppParser, Workflow, GacUI
- GacUI features
- ScreenShots
- Showcase
  - www.majorav.com

## Tutorial page

- C++ file dependencies
- Details description of files
- How to pick files
- Setup by setup building a HelloWorld application with MVVM

## Demo page

- Introduction to demos
- Detail information about each demo

## Document page

- Use the existing Document.html for now

## Contact page

contact information
