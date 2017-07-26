'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);

app.controller('LoginCtrl', function ($scope, $window, $http, $sce, socket) {

    $scope.sendLogin=function() {

        var varHTML;

        if(($scope.usernameemail == '' || $scope.usernameemail == undefined) &&($scope.password == ''  || $scope.password == undefined)) {
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = 'Molimo unesite korisničko ime ili email te lozinku.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);

        }else if($scope.usernameemail == '' || $scope.usernameemail == undefined){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML='Molimo unesite korisničko ime ili email.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }else if($scope.password == '' || $scope.password == undefined){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML='Molimo unesite lozinku';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);



        }
        else{
            $http.post('/api/login',{username: $scope.usernameemail, password: $scope.password}).
            then(function successCallback(data) {

                if(data.data == "cool"){
                     $scope.showMsg = {'visibility':'hidden'};
                     $window.location.href = '/test';
               }else{
                   console.log("Rejected");
                    $scope.showMsg = {'visibility': 'visible'};
                    varHTML='<div style="color:red">Neuspijela autorizacija</div>';

                    $scope.insertHTML = $sce.trustAsHtml(varHTML);

               }

            },function errorCallback(data) {
                console.error("error in posting");
            });

           /* var data = {username : $scope.usernameemail, password : $scope.password};

            socket.emit('send:login',data);*/


        }
    }
});

app.controller('RegisterCtrl', function ($scope, $window, $http, $sce, $timeout) {
    $scope.sendRegistration = function(){
        var varHTML;

        if($scope.firstName == '' || $scope.firstName == undefined){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = 'Molimo unesite Vaše ime.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.lastName == '' || $scope.lastName == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite Vaše prezime.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.companyName == '' || $scope.companyName == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite ime poduzeća.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.transactionEmail == '' || $scope.transactionEmail == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite email adresu za transakcije.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.userName == '' || $scope.userName == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite korisničko ime.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.userEmail == '' || $scope.userEmail == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite korisnički email.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.password == '' || $scope.password == undefined){
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Molimo unesite lozinku (Najmanje 6 znakova).';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else if($scope.password != $scope.confirmPassword) {
            $scope.showMsg = { 'visibility': 'visible' };
            varHTML = 'Potvrdite lozinku.';

            $scope.insertHTML = $sce.trustAsHtml(varHTML);
        }
        else{
            $http.post('/api/register', {firstName: $scope.firstName, lastName: $scope.lastName, companyName: $scope.companyName,
                transactionEmail: $scope.transactionEmail, userName: $scope.userName, userEmail: $scope.userEmail, password: $scope.password}).
            then(function SuccessCallback(data) {

                    if (data.data == "errorusername") {
                        $scope.showMsg = {'visibility': 'visible'};
                        varHTML = '<div style="color:red">Korisničko ime već postoji.</div>';

                        $scope.insertHTML = $sce.trustAsHtml(varHTML);
                    }
                    else if(data.data == "erroremail"){
                        $scope.showMsg = {'visibility': 'visible'};
                        varHTML = '<div style="color:red">Korisnički email već postoji.</div>';

                        $scope.insertHTML = $sce.trustAsHtml(varHTML);
                    } else if(data.data == "success"){

                    $scope.showMsg = {'visibility': 'visible'};
                    varHTML = '<div style="color:blue">Uspješna registracija.</div>';

                    $scope.insertHTML = $sce.trustAsHtml(varHTML);
                        $timeout(function () { $window.location.href = '/login';}, 2500);

                }
            }, function errorCallback(data) {
                console.error("error in posting");
            });
        }
    }
});

app.controller('showProject', function($scope, $location){
    $scope.showProject = function(project){
        $location.path('#/project-list/' + project.id);
    };
});

app.controller('showProjectGroup', function($scope) {
    $scope.name = 'World'; // <-- ...The hell???
});

app.controller('CreateProCtrl', function($scope, $window, $http, $sce){
     //lets make angular change some shit
    $scope.IBANS=[];
    $scope.IBANS.push({
        value: "X",
        button: ""
    });
    var deletedthefirst=false;
    $scope.addIBAN = function(){
        var varHTML;

        if($scope.newIBAN == undefined || $scope.newIBAN == null){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = '<div style="color:red">Novi IBAN nije unesen</div>';
            $scope.insertHTML = $sce.trustAsHtml(varHTML);
            return;
        }
        if($scope.newIBAN.length < 21){
            $scope.showMsg = {'visibility': 'visible'};
            varHTML = '<div style="color:red">Uneseni IBAN je kraći od 21</div>';
            $scope.insertHTML = $sce.trustAsHtml(varHTML);
            return;
        }
        $http.post('/api/IBAN', {IBAN: $scope.newIBAN, workmode: 'add'}).
        then(function SuccessCallback(data) {

            if (data.data == "success") {
                console.log('found');

            }
            else if(data.data == "failure"){
                console.log('notfound');
                //sve proslo
                $scope.showIBANS = {'visibility': 'visible'};

                if(deletedthefirst==false){
                    $scope.IBANS.splice(0,1);
                    deletedthefirst=true;
                }
                $scope.IBANS.push({
                    value: $scope.newIBAN,
                    button: ""
                });
                console.log($scope.IBANS);
                $scope.newIBAN='';
                $scope.showMsg = {'visibility': 'hidden'};
            }
        }, function errorCallback(data) {
            console.error("error in posting");
        });






    };



    $scope.delIBAN = function(index){
        $scope.IBANS.splice(index,1);
        console.log($scope.IBANS);

    };





     $scope.sendProject = function(){
         var varHTML;
         if($scope.projectName == '' || $scope.projectName == undefined){
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije uneseno ime projekta.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);

             return;
         }
         else if($scope.durationStart == '' || $scope.durationStart == undefined) {
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije unesen datum početka.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);

             return;
         }else if($scope.durationEnd == '' || $scope.durationEnd == undefined){
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije unesen datum kraja.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);

             return;
         }else if(($scope.budget == '' || $scope.budget == undefined) && ($scope.budget != '0')){
             $scope.showMsg = {'visibility': 'visible'};
             varHTML = '<div style="color:red">Nije unesen budžet.</div>';

             $scope.insertHTML = $sce.trustAsHtml(varHTML);
             return;


         }else{
             var diff=DateDiff.inDays($scope.durationStart,$scope.durationEnd);
             if(diff < 0 ){
                 $scope.showMsg = {'visibility': 'visible'};
                 varHTML = '<div style="color:red">Datum kraja postavljen prije datuma početka.</div>';

                 $scope.insertHTML = $sce.trustAsHtml(varHTML);

                 return;

             }else{

             }


         }
         //parsiranje datuma u string
          var sdatestr=$scope.durationStart.toString();
         var  edatestr=$scope.durationEnd.toString();


        console.log($scope.projectName+' '+$scope.durationStart+' '+$scope.durationEnd+' '+$scope.budget+' '+sdatestr+ edatestr);
         //ovdje nastavi
         $http.post('/api/IBANS', {IBANS: $scope.IBANS, NAME: $scope.projectName,STARTDATE: sdatestr, ENDDATE: edatestr, BUDGET: $scope.budget }).
         then(function SuccessCallback(data) {

             if (data.data == "success") {
                 console.log('found');

             }
             else if(data.data == "failure"){
                 console.log('notfound');
                 //sve proslo

             }
         }, function errorCallback(data) {
             console.error("error in posting");
         });
     }




});

app.controller('AppCtrl', function ($scope, socket) {
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

//functions
var DateDiff = {

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    }
};

