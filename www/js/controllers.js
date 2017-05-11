
angular.module('starter.controllers', [])

  // .controller('HomeCtrl',  ['$scope', '$location', '$filter', '$http', '$cordovaDevice', '$stateParams', function ($scope, $location, $filter, $http, $cordovaDevice ,$stateParams) {

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $cordovaDevice, $state, $ionicListDelegate,
    $location, $filter, $http, $stateParams) {


    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.goto = function (url) {
      $state.go(url);
    }
    //disapear buttons when click outside box
    $scope.show1 = false;
    $scope.show2 = false;
    $scope.click1 = function ($event) {
      $event.stopPropagation();
      $scope.show1 = !$scope.show1;
      $scope.show2 = false;
      $ionicListDelegate.closeOptionButtons();
    }
    $scope.click2 = function ($event) {
      $event.stopPropagation();
      $scope.show2 = !$scope.show2;
      $scope.show1 = false;
      $ionicListDelegate.closeOptionButtons();
    }
    $scope.hideAll = function () {
      $scope.show2 = false;
      $scope.show1 = false;
      $ionicListDelegate.closeOptionButtons();
    }

    // Sign out func
    $scope.signOut = function () {
      localStorage.clear();
      window.location = 'index.html';
    }

    // Sign out func
    $scope.signOut = function () {
      localStorage.clear();
      window.location = 'index.html';
    }

    //init user
    $scope.getUserDetails = function () {
      $scope.user = JSON.parse(localStorage.getItem('_user'));
      console.info('Welcome to Handy 3D', $scope.user);
      //remove coment below to show alert with device details > use in dev only !
      // alert('Welcome '+$scope.user.name);  
      document.addEventListener("deviceready", function () {
        $scope.device = {};
        $scope.device.device = $cordovaDevice.getDevice();
        $scope.device.cordova = $cordovaDevice.getCordova();
        $scope.device.model = $cordovaDevice.getModel();
        $scope.device.platform = $cordovaDevice.getPlatform();
        $scope.device.uuid = $cordovaDevice.getUUID();
        $scope.device.version = $cordovaDevice.getVersion();
        console.info('device obj: ', $scope.device);
        //alert(JSON.stringify($scope.device.device));
      }, false);
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

    $ionicModal.fromTemplateUrl('templates/modals/modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });

    //links 
    $scope.links = {
      prod: 'http://proj.ruppin.ac.il/bgroup48/prod/',
      prod_app: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/',
    }
    //  push handling 
    $scope.team_list = {};
    $scope.user_list = {};
    var user_platform;
    var notification_id;
    var SENDER_ID = "256793245079";

    document.addEventListener("deviceready", onCordovaReady, false);
    function onCordovaReady() {
      var push = PushNotification.init({
        "android": {
          "senderID": SENDER_ID
        },
        "ios": {
          "alert": "true",
          "badge": "true",
          "sound": "true",
          "senderID": SENDER_ID,
          "gcmSandbox": true
        },
        "windows": {}
      });
      push.on('registration', function (data) {
        notification_id = data.registrationId;
        console.log("this is data device: " + data);
        if (IsIphone()) {
          user_platform = "ios";
        }
        else {
          user_platform = "android";
        }
        $scope.register_notID();

      });
      push.on('notification', function (data) {
        console.log("notification event");

        if (data.additionalData.foreground && data.additionalData.sender != localStorage.user_name) {

          addMessageToChat(data.additionalData.sender, data.message);
        }
        else {

        }
        push.finish(function () {
          console.log('finish successfully called');
        });
      });
      push.on('error', function (e) {
        console.log("push error");
      });
    }

    function IsIphone() {
      var userAgent = navigator.userAgent;

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
      }
      else {

        return false;
      }
    }

    $scope.sendMsg = function () {
      var user_platform;
      var notification_id;
      $.ajax({
        type: "POST",
        url: "http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/sendMsg",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ platform: "android", not_id: nott, msg: "TEST!", user: $scope.user.name }),
        dataType: "json",
        success: function (data) {
        },
        error: function () {
        }
      })
    }
    $scope.regisPush = function () {
      document.getElementById('clickPush').click();
    }

    $scope.register_notID = function () {
      //remove comment in dev to reveal device info
      // alert($scope.user.id);
      // alert(notification_id);
      // alert(user_platform);
      var user = $scope.user.name;
      $http.post('http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/SetUserNotIdAndPlatform',
        { user_id: $scope.user.id, not_id: notification_id, platform: user_platform })
        .then(function (response) {
          console.log('%c Push d -insert Success', 'background: yellow; color: green');
        },
        function (err) {
          console.error('Failed -insert failed,');
          alert('Error please try again');
        })
    }
    $scope.push = {};
    //get all teams  team id + name 
    $scope.getAllTeams = function () {
      $http.get($scope.links.prod_app + 'getAllTeams')
        .then(function (response) {
          $scope.team_list = response.data;
          console.log($scope.user_list);
        })
    }
    //get all users  id + name

    $scope.getAllUsers = function () {
      $http.get($scope.links.prod_app + 'getAllUsers')
        .then(function (response) {
          $scope.user_list = response.data;
          console.log($scope.team_list);
        })
    }
    //send push to user
    $scope.sendPush = function () {
      console.log(this);
      if (this.push.sendTo == 'All') {
        $http.post($scope.links.prod_app + 'sendMsgToAll', { msg: this.push.pushMsg })
          .then(function () {
            console.log('%c  push -sent all ! Success', 'background: yellow; color: green');
          }),
          function (err) {
            console.error('push -sent all Something went wrong', err);
            alert('Error. try again');
          }
      }
      else if (this.push.sendTo == 'User') {
        $http.post($scope.links.prod_app + 'sendMsgToUser', { userId: this.push.id, msg: this.push.pushMsg })
          .then(function () {
            console.log('%c  push -sent user ! Success', 'background: yellow; color: green');
          }),
          function (err) {
            console.error('push -sent all Something went wrong', err);
            alert('Error. try again');
          }

      }
      else if (this.push.sendTo == 'Team') {
        $http.post($scope.links.prod_app + 'sendMsgToTeam', { TeamId: this.push.team, msg: this.push.pushMsg })
          .then(function () {
            console.log('%c  push -sent team ! Success', 'background: yellow; color: green');
          }),
          function (err) {
            console.error('push -sent team Something went wrong', err);
            alert('Error. try again');
          }
      }
    }
    // end push handling 
  })

  .controller('ProfileCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {

  }])

  .controller('TeamsCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {

    //get user teams; return team = { id
    // team_name
    // team_leader
    // physiotherapist
    // technician
    // designer}
    $http({
      method: 'GET',
      url: $scope.links.prod_app + 'getUserTeams',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        // userId: $scope.user.id
        user_id: $scope.user.id
      }
    })
      .then(function (res) {
        $scope.my_teams = res.data;
        console.log('Teams fetched', JSON.stringify($scope.my_teams));
      }),
      function (err) {
        console.error('Teams -get Something went wrong');
      }

    $scope.goToTeamDetails = function (team) {
      console.log('clicked: ', team.id);
      $state.go('app.team', { team });
    }
  }])

  .controller('TeamCtrl', ['$scope', '$http', '$state', function ($scope, $http, $stateParams) {

    $scope.team = $stateParams.params.team;
    console.log('team is:', $scope.team);

    $http({
      method: 'GET',
      url: $scope.links.prod + 'ClientService.asmx/getFullCustomerDetails',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        // userId: $scope.user.id
        team_id: $scope.team.id
      }
    })
      .then(function (res) {
        $scope.team = res.data;
        console.log('Teams fetched', JSON.stringify($scope.team));
      }),
      function (err) {
        console.error('Teams -get Something went wrong');
      }
  }])

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
          console.log(res.data);
          if ($scope.user == '0') {
            console.error('Wrong user name or password, try again');
            $scope.loginAlert = 'Wrong user name or password, try again';
          }
          else if ($scope.user == '-1') {
            console.error('user not active. please contact admin');
            $scope.loginAlert = 'user not active. please contact admin';
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
      url: $scope.links.prod_app + 'getNotificationsById',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        // userId: $scope.user.id
        userId: 1,
      }
    })
      .then(function (res) {

        $scope.notifications = res.data;
        console.log('Notifications fetched', JSON.stringify($scope.notifications));

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
  .controller('cameraCtrl', ['$scope', '$stateParams', '$cordovaCamera', '$cordovaFile', '$ionicBackdrop', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$http', '$cordovaCapture',
    function ($scope, $stateParams, $cordovaCamera, $cordovaFile, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $http, $cordovaCapture) {
      $scope.images = [];
      $scope.imageUrl = '';
      $scope.videoFile = '';
      $scope.clientList = [];
      $scope.meetinglist = [];
      $scope.m = {};
      var imgUrl;
      //Open Camera and dispaly photo
      $scope.addImage = function () {
        navigator.camera.getPicture(function (fileUri) {
          $scope.images.push(fileUri);
          //alert(fileUri)
          $scope.imageUrl = fileUri;
          imgUrl = fileUri;
          localStorage.setItem('images_array', imgUrl);
          $('#myImage2').attr("src", fileUri);
        })
      }

      //load client list per teams?!
      $http({
        method: "GET",
        url: $scope.links.prod_app + 'getUserClients',
        params: {
          userId: $scope.user.id
        }
      })
        .then(function (response) {
          $scope.clientList = response.data;
        })
      //get meetings number per clients here!
      $scope.getMettings = function () {
        clientID = this.m.c_id;
        $http({
          method: "GET",
          url: $scope.links.prod_app + 'getclientMeetings',
          params: {
            c_id: clientID
          }
        })
          .then(function (response) {
            $scope.meetinglist = response.data;
          })
      }
      //  function for Uploading Images
      $scope.UploadImages = function () {
        //alert($scope.imageUrl)
        console.log(this.m)
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
        ft.upload($scope.imageUrl, encodeURI($scope.links.prod + 'MediaAppHandler.ashx'), win, fail, options); // Upload
      } // Upload Photo

      function win(r) {
        var path = r.response;
        var savePath = $scope.links.prod + 'Client/src/' + path
        //uncomment to get url in alert
        // save to pic to DB
        $http({
          method: "GET",
          url: $scope.links.prod_app + 'SavePicToDB',
          params: {
            title: $scope.m.title,
            mediaDesc: $scope.m.desc,
            url: savePath,
            meetingNum: $scope.m.meetingNum,
            clientId: $scope.m.c_id,
            userId: $scope.user.id,
          }
        })
          .then(function (res) {
            alert("Image Saved")
          }),
          function (err) {
            console.log('Something went wrong');
          }
      }
      function fail(error) {
        alert("An error has occurred: Code = " + error);
      }

      $scope.TakeVideo = function () {
        var options = {
          limit: 1,
          duration: 10
        };
        $cordovaCapture.captureVideo(options)
          .then(function (videoData) {
            $scope.videoFile = videoData[0].fullPath;
            alert(file_path);
          });
      }
      // viedo upload -dev
      $scope.uploadVideo = function () {
        //alert($scope.videoFile)
        console.log(this.m)
        //   Load(); // Start the spinning "working" animation
        var options = new FileUploadOptions(); // PhoneGap object to allow server upload
        options.fileKey = "file";
        options.fileName = "pic4"; // file name
        options.mimeType = "video/mp4"; // file type
        var params = {}; // Optional parameters
        params.value1 = "test";
        params.value2 = "param";

        options.params = params; // add parameters to the FileUploadOptions object
        var ft = new FileTransfer();
        ft.upload($scope.videoFile, encodeURI($scope.links.prod_app + 'VideoHandler.ashx'), win, fail, options); // Upload
      }
    }
  ])
  .filter('serchMyMedia', function () {
    return function (input, User) {
      var output = [];

      angular.forEach(input, function (item) {

        if (item.UserID === $scope.user.id) {
          output.push(item)
        }
      });

      return output;
    }
  })

  //Photo Gallery
  .controller('GalleryCtrl', function ($scope, $http, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
    $scope.clientList = [];
    $scope.clientTeam_list = [];
    $scope.me = $scope.user.id;

    //get User Clients
    $http({
      method: "GET",
      url: $scope.links.prod_app + 'getUserClients',
      params: {
        userId: $scope.user.id
      }
    })
      .then(function (response) {
        $scope.clientList = response.data;
      })

    //get User Teams Only

    $http({
      method: "GET",
      url: $scope.links.prod_app + 'getUserTeams',
      params: {
        user_id: $scope.user.id
      }
    })
      .then(function (response) {
        console.log($scope.user.id)
        console.log("sucsses")
        $scope.clientTeam_list = response.data;
        console.log($scope.clientTeam_list)
      })

    $scope.selectedDist = {};
    $scope.filterExpression = function (thana) {
      return (thana.dId === $scope.selectedDist.id);
    };

    // http request to get all images in DB
    $scope.getPic = function () {
      $http({
        method: "GET",

        url: $scope.links.prod_app + 'LoadPic',

        params: {
          userID: $scope.user.id,
          type: $scope.user.type
        }
      })
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
      alert("in")
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

    $scope.deletePhoto = function (n) {
      var id = n;
      if (confirm("You sure you want to delete this photo?") == true) {
        $http({
          method: "GET",
          url: $scope.links.prod_app + 'SetUnActive',
          params: {
            MediaID: id
          }
        }
        )
          .then(function (res) {
            $scope.getPic();//refresh image list
            console.info('Success,  :')
          }),
          function (err) {
            console.log('Something went wrong');
          }
      } else {
        return;
      }
    }
  })

  .controller('HomeCtrl', ['$scope', '$location', '$filter', '$http', '$cordovaDevice', '$stateParams', function ($scope, $location, $filter, $http, $cordovaDevice, $stateParams) {
    $scope.home = 'home :)';

  }])


  ;


