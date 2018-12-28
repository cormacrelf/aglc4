# AGLC4 in CSL and CSL-M

## Reference library

The references are either stored directly in CSL-JSON files, or in a 
Zotero/Juris-M collection with a copy of the output also stored in git as 
CSL-JSON such that the test suite can be run on Netlify and Travis.

The ones in `corpus.json` are currently sourced from my own Juris-M library. 
When the great unification into the [shared 
group](https://www.zotero.org/groups/684844) occurs, it will be built from 
there.

At the moment, my own library's output is built using [Zotero Better 
BibTex](https://retorque.re/zotero-better-bibtex/installation/) in 'Better CSL 
JSON' mode. This is because some entries are using the citekey pinning feature, 
but that dependency may be removed. Exporting is much faster using ZBB's 
caching, so it's definitely worth using.

## Build instructions

### 1. Install `node` v10+ and `yarn`.

`brew install node && npm i -g yarn` will do that on a Mac.

### 2. Install dependencies in BOTH the root and the `documentation` directory.

    yarn
    (cd documentation && yarn)

Do not use `npm install` for this. The dependency lockfiles are specific to 
Yarn.

### 3. Then

#### To run the tests on the command line

    yarn test

#### To preview the documentation site

    yarn doc-results && (cd documentation && yarn start)

Then open `http://localhost:3000` in your browser.

#### To preview the documentation site in watch mode

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
