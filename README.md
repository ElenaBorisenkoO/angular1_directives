# Small Angular project

This project demonstrates own realization of AngularJS directives by vanilla JS. 

## Installation

Use the package manager npm to install node-modules.

```bash
npm install
```
## Description

In this project you can find these directives:

```bash
ng-model
```
binds the value of HTML controls (input, select, textarea) to application data

```bash
ng-bind
```
binds the innerHTML of the element to the specified model property

```bash
ng-repeat
```
repeats a set of HTML, a given number of times


```bash
ng-click
```
allows you to specify custom behavior when an element is clicked

```bash
ng-show
```
shows or hides the given HTML element

```bash
to-uppercase 
```
converts string to uppercase

```bash
make-short
```
cut the text to the required amount symbols

```bash
random-color 
```
paints a background of element in a random color by click

### You may add any own directive the following way:

```bash
smallAngular.directive('ng-name-of-directive', function(scope, node, attrs) {
  ...
  ...
  scope.$apply();
  scope.$watch(name, watcher);
});
```
