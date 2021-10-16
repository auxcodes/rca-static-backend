[![Netlify Status](https://api.netlify.com/api/v1/badges/c07d61d3-11a9-497c-a068-73d3fd04f253/deploy-status)](https://app.netlify.com/sites/blissful-goodall-4a9520/deploys)

# Rise Community Art Website in Angular (With static backend)
<https://rca.aux.codes>
![Site Preview](https://github.com/auxcodes/images-to-json/blob/master/img/galleryPageTwo.png)

This is an archive repository for the original [Rise Community Art](https:risecommunityart.com.au) website.

## Frontend 
- Single Page Application implemented in Angular
- Responsive design
- All custom built components (Excluding shopping cart)
- Shopping cart API [Snipcart](https://snipcart.com) used to handle e-commerce


## Backend
- Current version uses a static backend of JSON files
- Original used the headless CMS [Directus](https://directus.io) hosted on Azure


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.2.

## Prerequisites

Before you begin, make sure your development environment includes Node.js® and an npm package manager.

### Node.js
Angular requires Node.js version 10.9.0 or later.

To check your version, run `node -v` in a terminal/console window.

To get Node.js, go to nodejs.org.

### npm package manager
Angular, the Angular CLI, and Angular apps depend on features and functionality provided by libraries that are available as npm packages. To download and install npm packages, you must have an npm package manager.

This setup guide uses the npm client command line interface, which is installed with Node.js by default.

To check that you have the npm client installed, run `npm -v` in a terminal/console window.

### Angular CLI
You use the Angular CLI to create projects, generate application and library code, and perform a variety of ongoing development tasks such as testing, bundling, and deployment.

Install the Angular CLI globally.

To install the CLI using npm, open a terminal/console window and enter the following command:

`npm install -g @angular/cli`

### Install project dependencies
The project has a number of package dependencies that will need to be installed.
This is done using npm:

`npm install`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
