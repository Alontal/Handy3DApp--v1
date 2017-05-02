angular.module('starter.controllers', [])


  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});
      
      // Sign out func
      $scope.signOut   = function(){
        localStorage.clear();
        window.location = 'index.html';
      }

      //init user
      $scope.getUserDetails = function () {
          $scope.user = JSON.parse(localStorage.getItem('_user'));
          console.info('Welcome to Handy 3D', $scope.user);
          // alert('Welcome '+$scope.user.name);
      }
      //settings init
      $scope.app = {
          user: {
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

      // Triggered in the  modal to close it
      $scope.closeModal = function () {
          $scope.modal.hide();
      };

      // Open the  modal
      $scope.Modal = function () {
          $scope.modal.show();
      };

      // Perform the  action when the user submits the login form
      $scope.doModalLogic = function () {
          console.log('Doing Modal', $scope.loginData);

          // Simulate a  delay.MODAL  Remove this and replace with your login
          // code if using a modAL system
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
      $scope.checkForExistingToken = function () {
          token = localStorage.getItem('_token_s$#@')
          //if exist redirect to main 
          console.log('token is: ', token);
          if (token != null) {
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
                localStorage.setItem('_user', JSON.stringify($scope.user));
                saveToken($scope.user.token);
                //$state.go('app.home');
                window.location = 'main.html';
            }),
            function (err) {
                console.error('Something went wrong');
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

    //Camera controller
        .controller('cameraCtrl', ['$scope', '$stateParams', '$cordovaCamera', '$cordovaFile', '$ionicBackdrop', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
                          function ($scope, $stateParams, $cordovaCamera, $cordovaFile, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
                              $scope.images = [];
                              //Open Camera and dispaly photo
                              $scope.addImage = function () {
                                  navigator.camera.getPicture(function (fileUri) {
                                      $scope.images.push(fileUri);
                                      console.info(fileUri);
                                      console.info($scope.images[0])
                                      localStorage.setItem('images_array', $scope.images);
                                  }
                                  )
                              }
                              //function for Uploading Images
                              $scope.UploadImages = function () {
      
                              }
                              // function to delete Image Taken from XXX

                          }])

    //Photo Gallery
.controller('GalleryCtrl', function ($scope, $http, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
    // http request to get all images in DB
    $scope.getPic = function () {
        $http({
            method: "GET",
            url: 'http://localhost:57943/GeneralService.asmx/LoadPic'
        }
        )
          .then(function (res) {
              $scope.allImages = res.data;

              console.info('Success,  :', $scope.allImages[0].URL)
          }),
          function (err) {
              console.log('Something went wrong');
          }
    }

    // image preview functions
    $scope.zoomMin = 1;
    $scope.test = function () {
        alert("in in");
    }

    $scope.zoomMin = 1;

    $scope.showImages = function (index) {
        $scope.activeSlide = index;
        $scope.showModal('templates/gallery-zoomview.html');
    };

    $scope.showModal = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove()
    };

    $scope.updateSlideStatus = function (slide) {
        var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
        if (zoomFactor == $scope.zoomMin) {
            $ionicSlideBoxDelegate.enableSlide(true);
        } else {
            $ionicSlideBoxDelegate.enableSlide(false);
        }
    };
})

  .controller('HomeCtrl', function ($scope, $stateParams) {
      $scope.home = 'home :)';

  })



  .factory('todoStorage', function () {
      var STORAGE_ID = 'todos';

      return {
          sync: function () {
              // sync  Todo's  with DB
              $scope.syncTodo = function () {
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
                          title: '',
                          completed: ''
                      }
                  })
                    .then(function (res) {
                        $scope.user = res.data;
                        console.log('ToDo was Synced :');
                    }),
                    function (err) {
                        console.error('Todo - Something went wrong');
                    }
              }
              // .   / Login authentication 


          },
          get: function () {
              return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
          },

          put: function (todos) {
              localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
          }
      };
  })

  .controller('TodoCtrl', ['$scope', '$location', '$filter', 'todoStorage', function ($scope, $location, $filter, todoStorage) {
      var todos = $scope.todos = todoStorage.get();

      $scope.newTodo = '';
      $scope.remainingCount = $filter('filter')(todos, { completed: false }).length;


      if ($location.path() === '') {
          $location.path('/');
      }

      $scope.location = $location;

      $scope.$watch('location.path()', function (path) {
          console.log(path);
          $scope.statusFilter = { '/app/todo/active': { completed: false }, '/app/todo/completed': { completed: true } }[path];
      });

      $scope.$watch('remainingCount == 0', function (val) {
          $scope.allChecked = val;
      });

      $scope.addTodo = function () {
          var newTodo = $scope.newTodo.trim();
          if (newTodo.length === 0) {
              return;
          }

          todos.push({
              title: newTodo,
              completed: false
          });
          todoStorage.put(todos);

          $scope.newTodo = '';
          $scope.remainingCount++;
      };

      $scope.editTodo = function (todo) {
          todo.editedTodo = true;
          // Clone the original todo to restore it on demand.
          $scope.originalTodo = angular.extend({}, todo);
      };

      $scope.doneEditing = function (todo) {
          todo.editedTodo = false;
          todo.title = todo.title.trim();

          if (!todo.title) {
              $scope.removeTodo(todo);
          }

          todoStorage.put(todos);
      };

      $scope.revertEditing = function (todo) {
          todos[todos.indexOf(todo)] = $scope.originalTodo;
          $scope.doneEditing($scope.originalTodo);
      };
      
      $scope.removeTodo = function (todo) {
          $scope.remainingCount -= todo.completed ? 0 : 1;
          todos.splice(todos.indexOf(todo), 1);
          todoStorage.put(todos);
      };

      $scope.todoCompleted = function (todo) {
          $scope.remainingCount += todo.completed ? -1 : 1;
          todoStorage.put(todos);
      };

      $scope.clearCompletedTodos = function () {
          $scope.todos = todos = todos.filter(function (val) {
              return !val.completed;
          });
          todoStorage.put(todos);
      };

      $scope.markAll = function (completed) {
          todos.forEach(function (todo) {
              todo.completed = completed;
          });
          $scope.remainingCount = !completed ? todos.length : 0;
          todoStorage.put(todos);
      };
  }]);


