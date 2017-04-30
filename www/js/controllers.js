angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //init user
      $scope.getUserDetails = function(){
        $scope.user = JSON.parse( localStorage.getItem('_user'));
        console.info('Welcome to Handy 3D', $scope.user);
        // alert('Welcome '+$scope.user.name);
      }
    //settings init
    $scope.app = {
      user:{
      name: 'Handy3D MobileApp',
      version: '0.0.1',
      },
      // for chart colors
      color: {
        primary: '#7266ba',
        info: '#23b7e5',
        success: '#27c24c',
        warning: '#fad733',
        danger: '#f05050',
        light: '#e8eff0',
        dark: '#3a3f51',
        black: '#1c2b36'
      }
    }
    // Form data for the login modal
    $scope.ModalData = {};

    // Create the  modal that we will use later
    $ionicModal.fromTemplateUrl('templates/modals/modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.Modal = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doModalLogic = function () {
      console.log('Doing Modal', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeModal();
      }, 1000);
    };


    //links 
    $scope.links = {
      general: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx',
    }
  })

  .controller('LoginCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {

    //check for existing token --> if exist redirect to home 
    $scope.checkForExistingToken = function(){
      token = localStorage.getItem('_token_s$#@')
      //if exist redirect to main 
      console.log('token is: ',token);
      if ( token != null ){
        window.location = 'main.html';
      }
    }
    // .  /check for existing token in local storage

    // Login authentication 
    $scope.doLogin = function () {
      var u = {
        Email: $scope.login.email,
        Password: $scope.login.password
      }
      console.info('Trying to login....', u)
      // http get user by password & email  
      $http({
        method: "GET",
        url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/LoginAuth',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          email: u.Email,
          password: u.Password
        }
      })
        .then(function (res) {
          $scope.user = res.data;
          console.info('Success, Hi mr/ms :', $scope.user);
          localStorage.setItem('_user', JSON.stringify($scope.user) );
          saveToken($scope.user.token);
          //$state.go('app.home');
          window.location = 'main.html';
        }),
        function (err) {
          console.log('Something went wrong');
        }
    }
    // .   / Login authentication 

    //save token to local storage
    function saveToken(token) {
      if (token) {
        localStorage.setItem('_token_s$#@', token)
      }
    }

  }])

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  })

  .controller('cameraCtrl', function ($scope, $stateParams) {
    $scope.camera = 'scope :)'
  })

  .controller('GeneralCtrl', function ($scope, $stateParams) {
  })

  .controller('HomeCtrl', function ($scope, $stateParams) {
    $scope.home = 'home :)';

  });
