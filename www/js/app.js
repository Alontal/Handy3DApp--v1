// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

  .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
          //get device type

          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          if (window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);

          }
          if (window.StatusBar) {
              // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
          }
      });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })
        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                },
            }
        })
        .state('app.login', {
            url: '/login',
            views: {
                'menuContent': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                },
            }
        })
        .state('app.profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileCtrl'
                },
            }
        })
        .state('app.teams', {
            url: '/teams',
            views: {
                'menuContent': {
                    templateUrl: 'templates/teams.html',
                    controller: 'TeamsCtrl'
                },
            }
        })
        .state('app.team', {
            url: '/team',
            params: {
                team: null
            },
            views: {
                'menuContent': {
                    templateUrl: 'templates/team.html',
                    controller: 'TeamCtrl'
                },
            }
        })
        .state('app.todo', {
            url: '/todo',
            views: {
                'menuContent': {
                    templateUrl: 'templates/todos.html',
                    controller: 'TodoCtrl'
                },
            }
        })
        .state('app.todo.list', {
            url: '/{fold}'
        })
        .state('app.camera', {
            url: '/camera',
            views: {
                'menuContent': {
                    templateUrl: 'templates/camera.html',
                    controller: 'cameraCtrl'
                },
            }
        })
        .state('app.profile_image', {
            url: '/profile_image',
            views: {
                'menuContent': {
                    templateUrl: 'templates/profile_image.html',
                    controller: 'cameraCtrl'
                },
            }
        })

        .state('app.browse', {
            url: '/browse',
            views: {
                'menuContent': {
                    templateUrl: 'templates/browse.html',
                    controller: 'GalleryCtrl'
                }
            }
        })
        .state('app.Notifications', {
            url: '/notifications',
            views: {
                'menuContent': {
                    templateUrl: 'templates/notifications.html',
                    controller: 'NotificationsCtrl'
                }
            }
        })
        .state('app.Notification', {
            url: '/notification',
            params: {
                notification: null
            },
            views: {
                'menuContent': {
                    templateUrl: 'templates/notification.html',
                    controller: 'NotificationCtrl'
                }
            }
        })
          .state('app.push', {
              url: '/push',
              views: {
                  'menuContent': {
                      templateUrl: 'templates/push.html'
                  },
              }
          })

      // .state('app.single', {
      //   url: '/notifications/:notificationId',
      //   views: {
      //     'menuContent': {
      //       templateUrl: 'templates/notification.html',
      //       controller: 'NotificationCtrl'
      //     }
      //   }
      // })
      ;

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/app/home');

      // fall back when insert incorrect address >> fallback to index.html
      //$urlRouterProvider.otherwise(function () {
      // window.location = 'index.html';
      //})
  });
