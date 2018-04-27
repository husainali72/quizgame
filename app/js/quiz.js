var app = angular.module("quiz-game", []);

app.controller('askQuestionController', function($rootScope, $scope, $http, $timeout) {
    $scope.step1 = false;
    $scope.step2 = false;
    $scope.questions = [];
    $scope.totalAnswer = 0;
    $scope.loadingQuestions = false;

    $scope.startQuiz = function(argument) {
        $scope.loadingQuestions = true;
        $http({
            method: "post",
            url: "/questions/list-all"
        }).then(function(res) {
            $scope.loadingQuestions = false;

            if (res.data.success) {
                $scope.questions = res.data.questions;
            } else {
                alert(res.message);
            }
            $scope.totalAnswer = $scope.questions.length;
            $scope.step1 = true;
        }, function(err) {
            console.log(err)
            alert('Some error occurs. Please try again.');
        });
    }

    $scope.score = 0;

    $scope.processAnswers = function() {
        for (var i in $scope.questions) {
            if ($scope.questions[i].response == $scope.questions[i].answer) {
                $scope.score++;
            }
        }
        $scope.step1 = false;
        $scope.step2 = true;
    }

    $scope.playAgain = function(argument) {
        $scope.step1 = false;
        $scope.step2 = false;

        for (var i in $scope.questions) {
            $scope.questions[i].response = '';
        }
    }

});