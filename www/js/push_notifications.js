'use strict';

// push controller
app.controller('PushCtrl', ['$scope', '$location', '$filter', '$http', '$cordovaDevice', function ($scope, $location, $filter, $http, $cordovaDevice) {
    console.log('push ctrl loaded',$scope.device);


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
            console.log(data);
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
        $scope.register_notID = function() {
        alert($scope.user.id);
        alert(notification_id);
        alert(user_platform);

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
}])