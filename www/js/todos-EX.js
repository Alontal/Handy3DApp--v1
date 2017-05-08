
'use strict';

/* Controllers */

// todos controller
 app.factory('todoStorage', ['$http', function ($http) {
    var STORAGE_ID = 'todos';
    var u = JSON.parse(localStorage.getItem('_user') || '[]');
    var userid = u.id
    console.log(userid);
    return {

      get: function () {
        var todo;
        // $http({
        //   method: "GET",
        //   url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/getTodosByUid',
        //   headers: {
        //     'Content-Type': 'application/json; charset=utf-8',
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   params: {
        //     userId: userid
        //   }
        // })
        //   .then(function (res) {
        //     //todo = res.data;
        //     //console.log(' recived', JSON.stringify(todo));
        //   }),
        //   function (err) {
        //     console.error('Todo -get Something went wrong');
        //   }
        // return JSON.parse(todo || '[]');

        return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
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

  app.controller('TodoCtrl', ['$scope', '$location', '$filter', 'todoStorage', '$http', function ($scope, $location, $filter, todoStorage, $http) {
    //  get todos from db on loading
    // $http({
    //   method: "GET",
    //   url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/getTodosByUid',
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8',
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   params: {
    //     userId: 1
    //   }
    // })
    //   .then(function (res) {
    //     $scope.todos = res.data;
    //     console.log(' todos fetched', JSON.stringify($scope.todos));
    //   }),
    //   function (err) {
    //     console.error('Todo -get Something went wrong');
    //   }
    
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
        // id: $scope.user.name +'_todo'
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
  }])