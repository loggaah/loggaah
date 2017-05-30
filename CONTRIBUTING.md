# Contributing

## Code Style

If you want to contribute to the library, here are a few guidelines to follow to keep code in one style.

### File Names
Any file that exports a class or an instance of a class should have the ```.class``` extension, with an upper case first
letter. Tests for a class should have the same name with the suffix ```.test```. All files including Javascript code
should end with the extension ```.js```.

### Imports
Imports are done in 2 optional groups in the following order: Node/NPM packages and local files. All in
alphabetical variable name order. Variables should be the same name as the imported package. Between each group there is
one line space and after the imports there is 2 lines space before any code specific to the file starts.

```
const _ = require('lodash');
const fs = require('fs');
const moment = ('moment');
const util = require('util');

const Core = require('./Core.class.js');


// Code starts here
```

### String quotes
The code is preferred using single quote strings. Template strings are also okay to use, but should only be used if
a template is actually used. Double quoted strings and template string are both okay when you want to prevent escaping
quote characters.

### General guidelines
* All lines should be terminated with ```;```
* All loops and conditions always use braces, even if it's a single line command
* Short style if conditions (```<test> ? <true result> : <false result>```) are preferred for simple conditions
* Line width is 120 characters as a guideline, meaning that it's not strictly followed everywhere
* Use jsdoc on every class and method defined within the ```lib/``` directory
* The code uses camel case
