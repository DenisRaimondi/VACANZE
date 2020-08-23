var App = angular.module("App", ["ngRoute"]);

App.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "./Components/recapComponent/recapComponent.html"
    })
    .when("/table", {
      templateUrl: "./Components/tableComponent/tableComponent.html"
    });
});
