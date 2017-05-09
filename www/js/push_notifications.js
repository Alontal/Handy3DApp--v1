'use strict';

// push controller
app.controller('PushCtrl', ['$scope', '$location', '$filter', '$http', '$cordovaDevice', function ($scope, $location, $filter, $http, $cordovaDevice) {
    console.log('push ctrl loaded',$scope.device);


    var user_platform;
    var notification_id;
    var SENDER_ID = "256793245079";
    //var webServerAddress = "../";
    var webServerAddress = "http://proj.ruppin.ac.il/igroup77/prod/";

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
            alert(data.registrationId);

            if (IsIphone()) {
                user_platform = "ios";
            }
            else {
                user_platform = "android";
            }

            alert(user_platform)
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

    $scope.sendMsg =  function () {


        var user_platform;
        var notification_id;
        var nott = "f6IMVrOP4ig:APA91bE_NlNNHNFASpQJYWxaJLEX2hdghsgx14hDTz356xLjxkpEvftwsJsbNNAAwn1MhAfDBnnl5ijsWJQIhA-uz0YbYte9LgKuw7VOBfPmsn_0Axihrdl408cXwB6xPxKe3eobij94";
        $.ajax({

            type: "POST",
            url: "http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/sendMsg",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ platform: "android", not_id: nott, msg: "TEST!", user: $scope.user.name }),
            dataType: "json",
            success: function (data) {

                alert('yes')
            },
            error: function () {
                alert('fail')
            }

        })
   
        addMessageToChat(localStorage.user_name, $("#msg").val());
        $("#msg").val('');
        window.scrollTo(0, document.body.scrollHeight);
    }

    $scope.register_notID = function() {
        alert($scope.user.name);
        alert(notification_id);
        alert(user_platform);

        var user = $scope.user.name
        var not = notification_id;
        var plat =user_platform

        $http.post('http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/SetUserNotIdAndPlatform', { user_name: $scope.user.name, not_id: notification_id, platform: user_platform })
           .then(function (response) {
               //localStorage.removeItem("user");
               console.log('%c Todo -insert Success', 'background: yellow; color: green');
               $scope.getTodosFrom_db();
           },
           function (err) {
               console.error('Failed -insert failed,');
               alert('Error please try again');
           })
      



    }

    function addMessageToChat(name, messageContent) {
        var d = new Date();

        var $d = $("<div>").addClass("msgContainer");
        var $p = $("<p>").text(messageContent).addClass("msgContent");
        var $s = $("<span>").text(name).addClass("sender");
        var $t = $("<span>").text(d.getHours() + ":" + d.getMinutes()).addClass("time");

        $("#content").append($d.append($s, $t, $p));

    }



}])