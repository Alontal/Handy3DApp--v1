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


    //links 

    $scope.links = {
      general: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx',
    }
  })
  .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {

    //$scope.login = {};

    $scope.doLogin = function () {
      var u = {
        Email: $scope.login.email,
        Password: $scope.login.password
      }
      console.info('trying to login....', u)

      $http({
        method: "GET",
        url: $scope.links.general + '/LoginAuth',
        // headers: {
        //   'Content-Type': 'application/json; charset=utf-8',
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        params: {
          email: u.Email,
          password: u.Password
        }

      }).then(function (res) {
        console.info('success', res.data)
      }),
        function (err) {
          console.log('Something went wrong');
        }

    }

    //   check authentication  
    //   $http.post($scope.links.general + 'LoginAuth',{params: {u}} )
    //     .then(function (response) {
    //       // var data = response.data.d;
    //       // $scope.user= {
    //       //   Fname: data.name,
    //       //   Lname: '',
    //       //   type: data.type,
    //       //   desciption: '',
    //       //   email: $scope.email,
    //       //   id: ''
    //       // }
    //       // console.info('user: ', $scope.user);
    //     },
    //     function (err) {
    //       console.log('failed to load ');
    //     })
    // };


    function saveToken(token) {
      if (token) {
        localStorage.setItem('token', token)
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
  });
