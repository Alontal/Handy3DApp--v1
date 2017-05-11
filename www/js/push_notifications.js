'use strict';

// push controller
app.controller('PushCtrl', ['$scope', '$location', '$filter', '$http', '$cordovaDevice', function ($scope, $location, $filter, $http, $cordovaDevice) {
    console.log('push ctrl loaded', $scope.device);

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
    $scope.register_notID = function () {
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
        if (sendTo == 'All') {
            $http.post($scope.links.prod_app + 'sendMsgToAll', { msg: this.push.pushMsg })
                .then(function () {
                    console.log('%c  push -sent all ! Success', 'background: yellow; color: green');
                }),
                function (err) {
                    console.error('push -sent all Something went wrong', err);
                    alert('Error. try again');
                }
        }
        else if (sendTo == 'User') {
            $http.post($scope.links.prod_app + 'sendMsgToUser', { userId: this.push.id, msg: this.push.pushMsg })
                .then(function () {
                    console.log('%c  push -sent user ! Success', 'background: yellow; color: green');
                }),
                function (err) {
                    console.error('push -sent all Something went wrong', err);
                    alert('Error. try again');
                }

        }
        else if (sendTo == 'Team') {
            $http.post($scope.links.prod_app + 'sendMsgToTeam', { teamId: this.push.team, msg: this.push.pushMsg })
                .then(function () {
                    console.log('%c  push -sent team ! Success', 'background: yellow; color: green');
                }),
                function (err) {
                    console.error('push -sent team Something went wrong', err);
                    alert('Error. try again');
                }
        }


    }



}])