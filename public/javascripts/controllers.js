'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('LoginCtrl', function ($scope, $window, socket) {

    $scope.sendLogin=function() {
        //$window.alert($scope.usernameemail);
        var data = {username : $scope.usernameemail, password : $scope.password};
        socket.emit('send:login',data);
    }
}).
  controller('AppCtrl', function ($scope, socket) {
   $scope.sendMessage=function() {
       socket.emit('send:message', function (data) {

       });
   }
  }).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
