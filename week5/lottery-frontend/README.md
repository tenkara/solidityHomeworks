# LotteryFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Too much fighting with Angular 15 and had to reinstall front end from scratch with Angular 14

Here is my cheatsheet for the front-end (lesson 15)
ng new lottery-frontend
Yes to Angular routing
Select SCSS for stylesheet
cd ./lottery-frontend
ng serve (to test the setup)
exit (ctrl-c)
npm install ethers or yarn add ethers
yarn add bootstrap bootstrap-icons
yarn add @popperjs/core
yarn add @ng-bootstrap/ng-bootstrap
In angular.json be sure to have these lines -
            "styles": [
              "node_modules/bootstrap/scss/bootstrap.scss",
              "node_modules/bootstrap-icons/font/bootstrap-icons.css",
              "src/styles.scss"
            ],
            "scripts": [
              "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
            ]
...
In app.module.ts be sure to include NgbModule like this -
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
...


