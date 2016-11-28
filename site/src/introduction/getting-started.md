---
layout: section
section: introduction
namespace: Introduction
title: Getting Started
externals:
  getting-started-js: getting-started.js
  getting-started-html: getting-started.html
---

## Grabbing the code

d3fc and its dependencies are available via npm or the unpkg CDN. The d3fc project is composed of a number of separate
packages, detailed in the {{{ hyperlink 'annotation-api.html' title='API documentation' }}}. Each of these packages can be installed via npm and used independently, or if you you can install the entire d3fc bundle, which includes all of the separate packages.

This packaging style mirrors the way that D3(v4) is distributed.

### Installing the bundle with npm

d3fc depends on D3, you can install both the d3fc bundle and D3 via npm as follows:

```
npm install d3fc d3
```

Once installed, you can reference both of these within an HTML page as follows:

```html
<script src="node_modules/d3/build/d3.min.js"></script>
<script src="node_modules/d3fc/dist/d3fc.min.js"></script>
```

### CDN hosted versions

Alternatively you can link to the CDN hosted versions of d3fc and D3 directly:

```html
<script src="https://unpkg.com/d3/build/d3.min.js"></script>
<script src="https://unpkg.com/d3fc/dist/d3fc.min.js"></script>
```

You can also find the latest version (together with previous versions) on [cdnjs](https://cdnjs.com/libraries/d3fc).

## A quick chart

If you want a quick verification that everything has installed correctly, the following code will render a Cartesian chart:

```html
{{{ getting-started-html }}}
```

```js
{{{ getting-started-js }}}
```

Here is how the chart should look:

{{{ dynamic-include 'codepen' html="getting-started-html" js="getting-started-js" }}}

{{{getting-started-html}}}
<script type="text/javascript">
{{{getting-started-js}}}
</script>

The next step is to follow the more in-depth tutorial on {{{ hyperlink 'building-a-chart.html' title='building a chart' }}}.
