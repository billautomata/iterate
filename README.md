iterate
=======

node based application to manage the github gist based design and review process

##### installation instructions
* install nodejs & npm
* clone repo

```sudo npm install -g supervisor```
```npm install```
```superivisor server.js```
```npm test```

##### instructions for use

* install gistup `npm install -g gistup`
* create all of your gists in the `gist_local` folder of the root
  * after you create your gist, you need to rename the directory to the hash in order for the `#local` feature to work
* go to `http://host:port/#gist_sha` to view the code in your gist from github
* go to `http://host:port/#gist_sha#local` to view the code in your local copy
* example `http://localhost:8000/#2508468d856680cf5351#local`

##### gists should have a structure

* `version.json`
  * example format - `
{
    "version": "0.0.1",
    "title": "new dashboard",
}`
*
* `readme.md`
  * displayed in it's own section
* `*.css`
* `*.js`
