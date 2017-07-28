'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('§');
    $interpolateProvider.endSymbol('§');
});

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

app.controller('listProjectGroups', function($scope){

    $scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";

    $scope.listGroupCollapseFn = function () {
        $scope.listGroupCollapse = [];
        for (var i = 0; i < $scope.storeDataModel.storedata.length; i += 1) {
            $scope.listGroupCollapse.push(false);
        }
    };


    $scope.selectTableRow = function (index, storeId) {
        if (typeof $scope.listGroupCollapse === 'undefined') {
            $scope.listGroupCollapseFn();
        }

        if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.storeIdExpanded === "") {
            $scope.tableRowIndexExpandedPrev = "";
            $scope.tableRowExpanded = true;
            $scope.tableRowIndexExpandedCurr = index;
            $scope.storeIdExpanded = storeId;
            $scope.listGroupCollapse[index] = true;
        } else if ($scope.tableRowExpanded === true) {
            if ($scope.tableRowIndexExpandedCurr === index && $scope.storeIdExpanded === storeId) {
                $scope.tableRowExpanded = false;
                $scope.tableRowIndexExpandedCurr = "";
                $scope.storeIdExpanded = "";
                $scope.listGroupCollapse[index] = false;
            } else {
                $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
                $scope.tableRowIndexExpandedCurr = index;
                $scope.storeIdExpanded = storeId;
                $scope.listGroupCollapse[$scope.tableRowIndexExpandedCurr] = true;
            }
        }
    };

    $scope.storeDataModel = {
        "metadata": {
            "storesInTotal": "25",
            "storesInRepresentation": "6"
        },
        "storedata": [{
            "store": {
                "storeId": "1000",
                "storeName": "Store 1",
                "storePhone": "+46 31 1234567",
                "storeAddress": "Avenyn 1",
                "storeCity": "Gothenburg"
            },
            "data": {
                "startDate": "2013-07-01",
                "endDate": "2013-07-02",
                "costTotal": "100000",
                "salesTotal": "150000",
                "revenueTotal": "50000",
                "averageEmployees": "3.5",
                "averageEmployeesHours": "26.5",
                "dayData": [{
                    "date": "2013-07-01",
                    "cost": "50000",
                    "sales": "71000",
                    "revenue": "21000",
                    "employees": "3",
                    "employeesHoursSum": "24"
                }, {
                    "date": "2013-07-02",
                    "cost": "50000",
                    "sales": "79000",
                    "revenue": "29000",
                    "employees": "4",
                    "employeesHoursSum": "29"
                }]
            }
        }, {
            "store": {
                "storeId": "2000",
                "storeName": "Store 2",
                "storePhone": "+46 8 9876543",
                "storeAddress": "Drottninggatan 100",
                "storeCity": "Stockholm"
            },
            "data": {
                "startDate": "2013-07-01",
                "endDate": "2013-07-02",
                "costTotal": "170000",
                "salesTotal": "250000",
                "revenueTotal": "80000",
                "averageEmployees": "4.5",
                "averageEmployeesHours": "35",
                "dayData": [{
                    "date": "2013-07-01",
                    "cost": "85000",
                    "sales": "120000",
                    "revenue": "35000",
                    "employees": "5",
                    "employeesHoursSum": "38"
                }, {
                    "date": "2013-07-02",
                    "cost": "85000",
                    "sales": "130000",
                    "revenue": "45000",
                    "employees": "4",
                    "employeesHoursSum": "32"
                }]
            }
        }, {
            "store": {
                "storeId": "3000",
                "storeName": "Store 3",
                "storePhone": "+1 99 555-1234567",
                "storeAddress": "Elm Street",
                "storeCity": "New York"
            },
            "data": {
                "startDate": "2013-07-01",
                "endDate": "2013-07-02",
                "costTotal": "2400000",
                "salesTotal": "3800000",
                "revenueTotal": "1400000",
                "averageEmployees": "25.5",
                "averageEmployeesHours": "42",
                "dayData": [{
                    "date": "2013-07-01",
                    "cost": "1200000",
                    "sales": "1600000",
                    "revenue": "400000",
                    "employees": "23",
                    "employeesHoursSum": "41"
                }, {
                    "date": "2013-07-02",
                    "cost": "1200000",
                    "sales": "2200000",
                    "revenue": "1000000",
                    "employees": "28",
                    "employeesHoursSum": "43"
                }]
            }
        }, {
            "store": {
                "storeId": "4000",
                "storeName": "Store 4",
                "storePhone": "0044 34 123-45678",
                "storeAddress": "Churchill avenue",
                "storeCity": "London"
            },
            "data": {
                "startDate": "2013-07-01",
                "endDate": "2013-07-02",
                "costTotal": "1700000",
                "salesTotal": "2300000",
                "revenueTotal": "600000",
                "averageEmployees": "13.0",
                "averageEmployeesHours": "39",
                "dayData": [{
                    "date": "2013-07-01",
                    "cost": "850000",
                    "sales": "1170000",
                    "revenue": "320000",
                    "employees": "14",
                    "employeesHoursSum": "39"
                }, {
                    "date": "2013-07-02",
                    "cost": "850000",
                    "sales": "1130000",
                    "revenue": "280000",
                    "employees": "12",
                    "employeesHoursSum": "39"
                }]
            }
        }, {
            "store": {
                "storeId": "5000",
                "storeName": "Store 5",
                "storePhone": "+33 78 432-98765",
                "storeAddress": "Le Big Mac Rue",
                "storeCity": "Paris"
            },
            "data": {
                "startDate": "2013-07-01",
                "endDate": "2013-07-02",
                "costTotal": "1900000",
                "salesTotal": "2500000",
                "revenueTotal": "600000",
                "averageEmployees": "16.0",
                "averageEmployeesHours": "37",
                "dayData": [{
                    "date": "2013-07-01",
                    "cost": "950000",
                    "sales": "1280000",
                    "revenue": "330000",
                    "employees": "16",
                    "employeesHoursSum": "37"
                }, {
                    "date": "2013-07-02",
                    "cost": "950000",
                    "sales": "1220000",
                    "revenue": "270000",
                    "employees": "16",
                    "employeesHoursSum": "37"
                }]
            }
        }, {
            "store": {
                "storeId": "6000",
                "storeName": "Store 6",
                "storePhone": "+49 54 7624214",
                "storeAddress": "Bier strasse",
                "storeCity": "Berlin"
            },
            "data": {
                "startDate": "2013-07-01",
                "endDate": "2013-07-02",
                "costTotal": "1800000",
                "salesTotal": "2200000",
                "revenueTotal": "400000",
                "averageEmployees": "11.0",
                "averageEmployeesHours": "39",
                "dayData": [{
                    "date": "2013-07-01",
                    "cost": "900000",
                    "sales": "1100000",
                    "revenue": "200000",
                    "employees": "12",
                    "employeesHoursSum": "39"
                }, {
                    "date": "2013-07-02",
                    "cost": "900000",
                    "sales": "1100000",
                    "revenue": "200000",
                    "employees": "10",
                    "employeesHoursSum": "39"
                }]
            }
        }],
        "_links": {
            "self": {
                "href": "/storedata/between/2013-07-01/2013-07-02"
            }
        }
    };

});




app.controller('CreateProCtrl', function($scope, $window, $http, $sce){
     //lets make angular change some shit
    $scope.names= [];

    $scope.IBANS=[];
    $scope.IBANS.push({
        value: "X",
        button: ""
    });
    var deletedthefirst=false;
//getibans
    $http.post('/api/GETIBANS', {HELLO: "HELLO"}).
    then(function SuccessCallback(data) {
           if(data.data=='failure'){
               console.log('NOTHING IN BASE');

           }else {
               console.log(data.data);
               console.log(data.data[0]);
               console.log(data.data.length);
               for(var i=0;i<data.data.length;i++){
                   $scope.names.push(data.data[i].IBAN);

                }
           }


    }, function errorCallback(data) {
        console.error("error in posting");
    });


 $scope.update=function(){

     $scope.showIBANS = {'visibility': 'visible'};

     if(deletedthefirst==false){
         $scope.IBANS.splice(0,1);
         deletedthefirst=true;
     }
     $scope.IBANS.push({
         value: $scope.dropdownIBAN,
         button: ""
     });
     console.log($scope.IBANS);
     $scope.newIBAN='';
     $scope.showMsg = {'visibility': 'hidden'};
    };






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
                //console.log('found');

            }
            else if(data.data == "failure"){
                //console.log('notfound');
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
         /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

