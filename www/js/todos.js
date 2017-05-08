'use strict';
// Todos controller
app.controller('TodoCtrl', ['$scope', '$location', '$filter', '$http', '$state', function ($scope, $location, $filter, $http, $state) {
    console.log('todo ctrl loaded');
    $scope.todos = [];
    $scope.newTodo = '';
    var todos = $scope.todos;
    // get todos from db 
    $scope.getTodosFrom_db = function () {
        $scope.todos = null;
        $http({
            method: "GET",
            url: 'http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/getTodosByUid',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                userId: $scope.user.id
            }
        })
            .then(function (res) {
                $scope.todos = res.data;
                console.log('Task -get Success:', $scope.todos);
            }),
            function (err) {
                console.error('Task -get Something went wrong');
            }
    };
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

    //add new todo
    $scope.addTodo = function () {
        // if empty return
        var newTodo = $scope.newTodo.trim();
        if (newTodo.length === 0) {
            return;
        }
        //generate new todo item
        var todo = {
            //id: $scope.user.name,
            userID: $scope.user.id,
            title: $scope.newTodo,
            owner: $scope.user.name,
            //XXX Alon:  if this user == admin need to set function for privacy, when admin assign new task
            privacyStatus: '2',  //need to set input in ui to choose privacy 
            completed: false,
        }
        $http.post('http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/insertTodo', { todo })
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

    // delete todo by id 
    $scope.deleteTodo = function (todo) {
        console.info('clicked', todo);

        $http.post('http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/deleteTodo', { todoId: todo.todoID })
            .then(function () {
                console.log('%c  Todo -delete Success', 'background: yellow; color: green');
                $scope.remainingCount -= todo.completed ? 0 : 1;
                //reload new list after insert
                $scope.getTodosFrom_db();
            }),
            function (err) {
                console.error('Todo -delete Something went wrong', err);
                alert('Error. try again');
            }
    }
    // mark todo as completed 
    $scope.updateTodo = function (todo) {
        console.info('clicked', todo);

        $http.post('http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/updateTodo', { todo })
            .then(function () {
                console.log('%c  Todo -update Success', 'background: yellow; color: green');
                //reload new list after insert
                $scope.getTodosFrom_db();
            }),
            function (err) {
                console.error('Todo -update Something went wrong', err);
                alert('Error. try again');
            }
    }
    $scope.clearCompletedTodos = function () {
        console.info('-delete all ! ! ');
        var id = $scope.user.id;
        $http.post('http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/deleteAllTodos', { id })
            .then(function () {
                console.log('%c  Todo -delete all ! Success', 'background: yellow; color: green');
                //reload new list after insert
                $scope.getTodosFrom_db();
                $state.reload();
            }),
            function (err) {
                console.error('Todo -delete all Something went wrong', err);
                alert('Error. try again');
            }
    };

    $scope.markAll = function () {

        console.info('-mark all');
        var id = $scope.user.id;
        $http.post('http://proj.ruppin.ac.il/bgroup48/prod/ApplicationGeneralService.asmx/markAllTodo', { id })
            .then(function () {
                console.log('%c  Todo -mark all Success', 'background: yellow; color: green');
                //reload new list after insert
                $scope.getTodosFrom_db();
            }),
            function (err) {
                console.error('Todo -mark all Something went wrong', err);
                alert('Error. try again');
            }
    };
}])