# AGLC4 in CSL and CSL-M

## Build instructions

Setup:

### 1. Install `node` v10+ and `yarn`.

`brew install node && npm i -g yarn` will do that on a Mac.

### 2. Install dependencies in BOTH the root and the `documentation` directory.

    yarn
    (cd documentation && yarn)

### To run the tests on the command line

    yarn test

### To preview the documentation site

    yarn doc-results && (cd documentation && yarn start)

Then open `http://localhost:3000` in your browser.

### To preview the documentation site in watch mode

Relies on [`entr(1)`](http://entrproject.org/) to watch files for changes.

    find src test -type f | entr yarn doc-results

And in another terminal tab/pane:

    (cd documentation && yarn start)

Then open `http://localhost:3000` in your browser.

The JSON files produced by the first watcher are watched in turn by the second. 
If you find that the page isn't updating, look at the output from the 
`doc-results` watcher; it might indicate what's wrong.

### Errors

Note that some of the error messages from `citeproc-js` are extremely 
unhelpful. If you make a mistake by writing unparsable or invalid CSL, I'm 
pretty sure it fails without a message or even a stack trace. Try using the 
validator or `citeproc-rs` to find errors, and checking that your library has 
everything that you referenced. Occasionally, the processor even fails if 
there's weird whitespace at the end of the file (I think). Any time there's an 
error thrown complaining about invalid JSON, it's probably a missing reference 
(because `citeproc-js` has the line 
`JSON.parse(JSON.stringify(this.sys.retrieveItem(""+id)))` that doesn't check 
if the inner result is null).
