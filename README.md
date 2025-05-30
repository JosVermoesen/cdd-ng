# Creditors Direct Debit - Domiciliëringen Schuldeiser

## Getting started for users

![CDD](img/cdd.png)

You can use directly on [demo site](https://cdd.vsoft.be)
Your data is stored as json files inside the localStorage of the browser you are using. With jsZip you can backup as zip file and/or transfert your data to other browsers and/or other computers

## Development Tools used for this app on april 2025

- [Install NVM for different versions of NodeJS)](https://github.com/coreybutler/nvm-windows/releases)
- In terminal `nvm install 22.14.0` and `nvm use 22.14.0`

- [Angular CLI v19)](https://www.npmjs.com/package/@angular/cli): `npm i -g @angular/cli@19`
- [Visual Studio Code](https://code.visualstudio.com/)

## Favorite vscode extensions and settings

- [MarkDown Lint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
- [XML Tools](https://marketplace.visualstudio.com/items?itemName=DotJoshJohnson.xml)
- [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)
- In settings 'brackets', activate Bracket Pair Colorization and Editor guides true
- In settings 'auto close', set 'Auto Closing Brackets' and 'Auto Closing Quotes' to 'always'

## Getting started for developers

- Clone this repository: `git clone https://github.com/JosVermoesen/cdd-ng.git`.
- Run `npm install` inside the project root.
- Run `ng serve -o` in a terminal from the project root.
- If scripts are disabled, open Powershell as administrator and run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` first!
- Profit. :tada:

## NPM packages used for this app

- [bootstrap(v5.3.3)](https://www.npmjs.com/package/bootstrap): `npm i bootstrap@5`
- [ngx-bootstrap](https://www.npmjs.com/package/ngx-bootstrap): `npm i ngx-bootstrap@19` (or greater)
- [file-saver](https://www.npmjs.com/package/file-saver): `npm i file-saver`
- [@types/file-saver](https://www.npmjs.com/package/@types/file-saver): `npm i @types/file-saver`
- [jszip](https://www.npmjs.com/package/jszip): `npm i jszip`
- [date-fns](https://www.npmjs.com/package/date-fns): `npm i date-fns`
- [@ngx-translate/core](https://www.npmjs.com/package/@ngx-translate/core): `npm i @ngx-translate/core@19`
- [@ngx-translate/http-loader](https://www.npmjs.com/package/@ngx-translate/http-loader): `npm i @ngx-translate/http-loader@15`

- install all packages in one commandline: `npm i bootstrap@5 ngx-bootstrap@19 file-saver @types/file-saver jszip date-fns @ngx-translate/core@19 @ngx-translate/http-loader@15`

## styles.css

For use of bootstrap, add into styles.css:

```bash
@import '~bootstrap/dist/css/bootstrap.min.css';
@import '~ngx-bootstrap//datepicker//bs-datepicker.css';
```

## Important1: tsconfig.json

Before building, add paths for jszip in compilerOptions AND set resolveJsonModule to 'true' :

```bash
"compilerOptions": {
    "paths": {
      "jszip": [
        "node_modules/jszip/dist/jszip.min.js"
      ]
    },
    "baseUrl": "./",
    ...
    "resolveJsonModule": true,
    ...
```

## warnings for file-saver

In angular.json, to avoid CommonJs warnings, add __allowedCommonJsDependencies__ in the options section for __file-saver, moment and jszip__:

```bash
"builder": "@angular-devkit/build-angular:browser",          
            ...
            "options": {
            "allowedCommonJsDependencies": [
              "file-saver",
              "moment",
              "jszip"]
            ...
```

## Angular 17.0.0 refactoring tools

Follow the instructions in the [Angular Update Guide](https://update.angular.io/) to fix your app.

### standalone components

You can switch older Angular programs to standalone with `ng generate @angular/core:standalone`

There are 3 options to refactor your code:

- `ng generate @angular/core:standalone-components-migration`
- `ng generate @angular/core:standalone-directives-migration`
- `ng generate @angular/core:standalone-pipes-migration`

IF YOU WANT YOUR APP CHANGED TO STANDALONE COMPONENTS YOU MUST RUN THESE MIGRATION COMMANDS WITH ANGULAR VERSION 17.x BEFORE MOVING TO THE NEXT VERSION OF ANGULAR. OTHERWISE YOU WILL GET ERROR IN LATER VERSION AND YOU HAVE TO DO ALL MANUALY!

## Updating to latest Angular 19

This app is now on Angular 19. Before starting an update, always commit first any valid open changes

update to latest Angular 19:
`ng update @angular/cli@19 @angular/core@19`

### Angular 19.0.0 refactoring tools

- `ng g @angular/core:signal-input-migration`
- `ng g @angular/core:signal-queries-migration`
- `ng g @angular/core:output-migration`

[Update to Angular 19](https://update.angular.io/)

## npm outdated

In terminal use `npm outdated` to see what packages are requiring updates and what their current and wanted versions are.

This will also show you which packages are deprecated.

If you want to update a package to a version newer than what is specified in your package.json, you can do so by running npm update [package-name]@[version-number].

## vulnerabilities

In terminal use `npm audit fix` to automatically install compatible updates to vulnerable dependencies.

You can first run `npm audit` to see vulnerabilities in your project for one or more packages.

Run `npm ls [package-name]` to see which packages depend on the vulnerable package.
