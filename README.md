# Viddist
A completely decentralized video streaming and publishing app

## Installation and usage
1. [Install go-ipfs](https://ipfs.io/docs/install/) and run `ipfs daemon` in another terminal. (This is needed because of a bug: the ipfs daemon inside of Viddist can right now only connect to other local(host) nodes, and when it doesn't find a single node it flips out. Because of this, right now Viddist can only play videos stored by other local ipfs nodes (e.g. go-ipfs or other Viddist clients). See src/index.js for example videos to use)
2. `git clone` Viddist, or download the project as a zip and unpack.
3. `cd` into the project directory and run `npm install`
4. Run `npm start`

## Contributing
It still needs some more refactoring before I'd recommend diving in, but so far:

* Run standard.js and ESLint on the code before committing. package.json has an eslint config provided. There are good plugins for (at least) vscode that automatically run these tools for you.
* Feel free to ask questions by opening issues or writing to me on irc (Powersource on freenode) or twitter (@the_lolness).
* PRs welcome, but if you want to try something bigger please talk to me first so we're on the same page :)