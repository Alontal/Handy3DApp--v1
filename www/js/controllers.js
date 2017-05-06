
angular.module('starter.controllers', [])


  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      // Sign out func
      $scope.signOut = function () {
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
          $scope.degub;
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
                $scope.degub = res.data;
                console.log(res.data);
                if ($scope.user == '0') {
                    console.error('Wrong user name or password, try again');
                }
                else if ($scope.user == '-1') {
                    console.error('user not active. please contact admin');
                }
                else if ($scope.user.name != undefined) {
                    console.info('Success, Hi mr/ms :', $scope.user);
                    localStorage.setItem('_user', JSON.stringify($scope.user));
                    saveToken($scope.user.token);
                    //$state.go('app.home');
                    window.location = 'main.html';
                }
            }),
            function (err) {
                console.error('Something went wrong');
                window.location = 'index.html';
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

  .controller('NotificationsCtrl', function ($scope, $http, $state) {
      $http({
          method: "GET",
          url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/getNotificationsById',
          headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          params: {
              // userId: $scope.user.id
              userId: 1
          }
      })
        .then(function (res) {
            $scope.notifications = res.data;
            console.log('Notifications fetched', JSON.stringify($scope.todos));
        }),
        function (err) {
            console.error('Notifications -get Something went wrong');
        }

      $scope.storeItem = function (notification) {
          console.info('item: ', notification);
          $state.go('app.Notification', { notification });
      }
      // $scope.notifications = [
      // {
      //   "id": 1,
      //   "title": "1",
      //   "description": "1",
      //   "createdBy": 3,
      //   "status": 1,
      //   "teamId": null,
      //   "meetingId": 1,
      //   "clientId": 1,
      //   "model_Id": null,
      //   "field1": null,
      //   "Client": null,
      //   "User": null,
      //   "Meeting": null,
      //   "Model": null,
      //   "PrivacyStatus": null,
      //   "Team": null
      // },
      // {
      // }]

  })

  .controller('NotificationCtrl', function ($scope, $stateParams) {
      $scope.notification = $stateParams;
      console.info('notifications: ', $scope.notification);
  })

  //Camera controller
  .controller('cameraCtrl', ['$scope', '$stateParams', '$cordovaCamera', '$cordovaFile', '$ionicBackdrop', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$http',


    function ($scope, $stateParams, $cordovaCamera, $cordovaFile, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $http) {
        $scope.images = [];
        $scope.imageUrl = '';
        $scope.clientList=[];
        var imgUrl;

       

        //Open Camera and dispaly photo
        $scope.addImage = function () {
            navigator.camera.getPicture(function (fileUri) {
                $scope.images.push(fileUri);
                $scope.imageUrl = fileUri;
                imgUrl = fileUri;
                console.info(fileUri);
                //console.info($scope.images[0])
                localStorage.setItem('images_array', imgUrl);
                $('#myImage2').attr("src", fileUri);
            }
            )
        }

        //load client list per teams?!
        $http({
            method: "GET",
            url : 'http://localhost:57943/ApplicationGeneralService.asmx/getUserClients',
            params:{
                userId : $scope.user.id
            }
        })
            .then(function (response){
                $scope.clientList = response;        
        })


        //get meetings number per clients here!



        //  function for Uploading Images
        $scope.UploadImages = function () {
            alert($scope.imageUrl)
            //   Load(); // Start the spinning "working" animation
            var options = new FileUploadOptions(); // PhoneGap object to allow server upload
            options.fileKey = "file";
            options.fileName = "pic4"; // file name
            options.mimeType = "image/jpeg"; // file type
            var params = {}; // Optional parameters
            params.value1 = "test";
            params.value2 = "param";

            options.params = params; // add parameters to the FileUploadOptions object
            var ft = new FileTransfer();
            ft.upload($scope.imageUrl, encodeURI("http://proj.ruppin.ac.il/bgroup48/prod/MediaAppHandler.ashx"), win, fail, options); // Upload
        } // Upload Photo

        function win(r) {
            var path = r.response;
            var savePath = "http://proj.ruppin.ac.il/bgroup48/prod" + path
            alert('Image Uploaded and save in :' + savePath);


            // save to pic to DB
            $http({
                method: "GET",
                url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/SavePicToDB',
                params: {
                    title: ,
                    mediaDesc:,
                    url:,
                    meetingNum:,
                    clientId ,
                    userId: $scope.user.id,

                }
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
        function fail(error) {
            alert("An error has occurred: Code = " + error);
        }
    }
  ])


  //Photo Gallery
  .controller('GalleryCtrl', function ($scope, $http, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
      //load clients pic by User


      //get all user Media


      // http request to get all images in DB
      $scope.getPic = function () {
          $http({
              method: "GET",
              url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/LoadPic'
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


  .factory('todoStorage', ['$http', function ($http) {
      var STORAGE_ID = 'todos';
      var u = JSON.parse(localStorage.getItem('_user') || '[]');
      var userid = u.id
      console.log(userid);
      return {

          get: function () {
              var todo;
              $http({
                  method: "GET",
                  url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/getTodosByUid',
                  headers: {
                      'Content-Type': 'application/json; charset=utf-8',
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  params: {
                      userId: userid
                  }
              })
                .then(function (res) {
                    //todo = res.data;
                    //console.log(' recived', JSON.stringify(todo));
                }),
                function (err) {
                    console.error('Todo -get Something went wrong');
                }
              return JSON.parse(todo || '[]');

              //return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
          },

          put: function (todos) {
              console.log('userid is:', userid);
              //var todos = todos;

              $http({
                  method: "GET",
                  url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/insertTodo',
                  headers: {
                      'Content-Type': 'application/json; charset=utf-8',
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  params: {
                      todos: todos
                  }
              })
                .then(function (res) {

                    console.info('returned from server: ', res.data);
                }),
                function (err) {
                    console.error('Todo -put  Something went wrong');
                }

              localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
          }
      };
  }])

  .controller('TodoCtrl', ['$scope', '$location', '$filter', 'todoStorage', '$http', function ($scope, $location, $filter, todoStorage, $http) {
      //  get todos from db on loading
      $http({
          method: "GET",
          url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/getTodosByUid',
          headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          params: {
              userId: 1
          }
      })
        .then(function (res) {
            $scope.todos = res.data;
            console.log(' todos fetched', JSON.stringify($scope.todos));
        }),
        function (err) {
            console.error('Todo -get Something went wrong');
        }

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
              userID: $scope.user.id,
              privacyStatus: 2,
              PrivacyStatus1: null,
              completed: false,
              User: null
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


