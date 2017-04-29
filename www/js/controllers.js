angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

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
  })
  .controller('LoginCtrl', function ($scope, $http) {

    $scope.doLogin = function(){
      
      console.log('Doing login', $scope.loginData);
    } 


  })

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
  });