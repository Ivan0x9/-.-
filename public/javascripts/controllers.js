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
                     $window.location.href = '/testtable';
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

app.controller('hoverLink', function($scope){
    $scope.open = false;
});

app.controller('showProject', function($scope, $location){
    $scope.showProject = function(project){
        $location.path('#/project-list/' + project.id);
    };
});

app.controller('showProjectGroup', function($scope) {
    $scope.name = 'World'; // <-- ...The hell???
});

app.controller('showTables', function($scope,$http){



    $http.post('/api/getprojects', {HELLO: "HELLO"}).
    then(function SuccessCallback(data) {
        if(data.data=='empty'){
            console.log('NOTHING IN BASE');
          //ako nema projekata
        }else {

           // console.log(data.data);
          var newdata = projectTableParser(data);
          for(var i=0;i<newdata.length;i++) {
              newdata[i].kategorija.sort(function (a, b) {
                  if (a.brojkat < b.brojkat) {
                      return -1;
                  }
                  if (a.brojkat > b.brojkat) {
                      return 1;
                  }
                  return 0;
              });
              newdata[i].kategorija.clean(undefined);
          }



           // console.log (newdata);
          $scope.projects = newdata;
        }






    }, function errorCallback(data) {
        console.error("error in posting");
    });

    $http.post('/api/gettrans', {HELLO: "HELLO"}).
    then(function SuccessCallback(data) {
        if(data.data=='empty'){
            console.log('NOTHING IN BASE');
            //ako nema transakcija
        }else {
            var newdata;
            //console.log(data.data);
            newdata = transactionTableParser(data.data);
            console.log(newdata);
            $scope.transactions=newdata;
        }


    }, function errorCallback(data) {
        console.error("error in posting");
    });





     $scope.tableshow = false;
    var result = document.getElementsByClassName("clickableRow");
        console.log(result);
     var i=0;
    $scope.hideTableRow=function($index,obj, $event){
        if (i ==0) {
            $scope.tableshow = true;
            i=1;
        }else if(i == 1){
            $scope.tableshow = false;
            i=0;
        }
        //console.log($event); - doesnt work
        console.log(obj);
        console.log(obj.currentTarget);
        console.log(obj.currentTarget.cells[0].innerHTML);

    };

    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
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

               for(var i=0;i<data.data.length;i++){
                   $scope.names.push(data.data[i].IBAN);

                }


           }


    }, function errorCallback(data) {
        console.error("error in posting");
    });


 $scope.update=function(index){

     $scope.showIBANS = {'visibility': 'visible'};

     if(deletedthefirst==false){
         $scope.IBANS.splice(0,1);
         deletedthefirst=true;
     }
     $scope.IBANS.push({
         value: $scope.dropdownIBAN,
         button: ""
     });
     //$scope.names.splice($scope.names.indexOf($scope.dropdownIBAN),1);
    //var  position=$scope.names.indexOf($scope.dropdownIBAN);
     //console.log($scope.IBANS);
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
                $scope.showMsg = {'visibility': 'visible'};
                varHTML = '<div style="color:red">IBAN već postoji.</div>';
                $scope.insertHTML = $sce.trustAsHtml(varHTML);

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
                //console.log($scope.IBANS);
                $scope.newIBAN='';
                $scope.showMsg = {'visibility': 'hidden'};
            }
        }, function errorCallback(data) {
            console.error("error in posting");
        });






    };



    $scope.delIBAN = function(index){
       // if($scope.IBANS.)
        $scope.IBANS.splice(index,1);
        //console.log($scope.IBANS);

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
         $http.post('/api/PUSHPROJECT', {name: $scope.projectName, start: sdatestr, end: edatestr, budget: $scope.budget, IBANS: $scope.IBANS  }).
         then(function SuccessCallback(data) {
             if(data.data=='success'){
                 console.log('NOTHING IN BASE redirect');

             }else {

                 console.log('Something went wrong');


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

var projectTableParser = function(data){


    var brojprojekata = data.data.length;
    var part = [];

    var projektlist=[{
        projekt : {},
        kategorija: [],
        budzet : {}

    }];






    for(var i=0; i< brojprojekata; i=i+1){
       // console.log(i);
        projektlist[i].projekt.id= data.data[i].about.id_projekt;
        projektlist[i].projekt.naziv= data.data[i].about.ime;
        var today = new Date();
        var endDate = new Date(data.data[i].about.datumkraj);
        projektlist[i].projekt.trajanje= DateDiff.inDays(today,endDate);
        projektlist[i].projekt.iznos= data.data[i].about.iznos;
       //console.log('WTF');
       for(var j=0;j<data.data[i].kategorija.length; j++) {
           if (data.data[i].kategorija[j].naziv == "Budžetni prihodi") {
               projektlist[i].budzet.id_budzet= data.data[i].kategorija[j].id_kategorija;
               projektlist[i].budzet.iznos= data.data[i].kategorija[j].troskovi;
           } else if (data.data[i].kategorija[j].naziv == "Nepovezani budžet") {
               projektlist[i].budzet.id_prebudzet= data.data[i].kategorija[j].id_kategorija;
               projektlist[i].budzet.preiznos= data.data[i].kategorija[j].troskovi;
           } else {

               projektlist[i].kategorija[j] = {
                   id_kat: data.data[i].kategorija[j].id_kategorija,
                   vrstakat: "N",
                   brojkat: "0",
                   naziv: data.data[i].kategorija[j].naziv,
                   budzet: data.data[i].kategorija[j].budzet,
                   troskovi: data.data[i].kategorija[j].troskovi,
                   preostaliiznos: data.data[i].kategorija[j].budzet - data.data[i].kategorija[j].troskovi


               };
               if (data.data[i].kategorija[j].naziv == "Ljudski resursi") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "1";
               } else if (data.data[i].kategorija[j].naziv == "Putovanja") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "2";
               } else if (data.data[i].kategorija[j].naziv == "Oprema i roba") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "3";
               } else if (data.data[i].kategorija[j].naziv == "Ostali troškovi i usluge") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "4";
               } else if (data.data[i].kategorija[j].naziv == "Troškovi obavljanja osnovne djelatnosti") {
                   projektlist[i].kategorija[j].vrstakat = "K";
                   projektlist[i].kategorija[j].brojkat = "5";
               }else if(data.data[i].kategorija[j].tezina_kat == 1){//podkategorija
                  var noviid;
                  for(var k=0; k <projektlist[i].kategorija.length;k++){
                      if(data.data[i].kategorija[j].id_kat == data.data[i].kategorija[k].id_kategorija){
                          noviid = data.data[i].kategorija[k].naziv;
                          if (noviid == "Ljudski resursi") {
                              projektlist[i].kategorija[j].brojkat = "1";
                          } else if (noviid == "Putovanja") {
                              projektlist[i].kategorija[j].brojkat = "2";
                          } else if (noviid == "Oprema i roba") {
                              projektlist[i].kategorija[j].brojkat = "3";
                          } else if (noviid == "Ostali troškovi i usluge") {
                              projektlist[i].kategorija[j].brojkat = "4";
                          } else if (noviid == "Troškovi obavljanja osnovne djelatnosti") {
                              projektlist[i].kategorija[j].brojkat = "5";
                          }



                      }
                  }
                   projektlist[i].kategorija[j].vrstakat = "P";





               }


           }
       }


       if(i != (brojprojekata-1)) {
           projektlist.push({
               projekt: {},
               kategorija: [],
               budzet: {}

           });
       }


    }





    return projektlist;



};


var transactionTableParser = function(data){

    var days,months,year;
    for(var i=0; i <data.length; i++){
        year=data[i].about.datum.substring(0,4);
        months=data[i].about.datum.substring(4,6);
        days=data[i].about.datum.substring(6,8);
        data[i].about.datum= days +"." + months +"."+ year;
        if(data[i].about.iznos < 0){
            data[i].about.color = "red";
        }else{
            data[i].about.color = "black"
        }

    }



    return data;

};

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};