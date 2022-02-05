(function () {
    'use strict';

    angular
        .module('dateCounter')
        .controller('DateCtrl', DateCounter);

    DateCounter.$inject = ['$scope', '$filter'];

    function DateCounter($scope, $filter) {
        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '2020:2050'
        };
        $('#datepicker').datepicker({ dateFormat: 'dd/mm/yy' });
        init();

        function init() {
            $scope.fromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.toDate = "";
            $scope.noDays = 270;
            $scope.results = calculateDate($scope.fromDate, $scope.noDays);
        }

        $scope.dateChange = function () {
            $scope.results = '';
            if (!$scope.fromDate) {
                return false;
            }
            $scope.results = calculateDate($scope.fromDate, $scope.noDays);
        }

        function calculateDate(startDate, days) {
            var splittedDate = startDate.split('/');
            var startDate = new Date(splittedDate[2], splittedDate[1] - 1, splittedDate[0]);
            var newDate = new Date(startDate);
            return newDate.setDate(startDate.getDate() + days);
        }

        // FAQ
        $("#overlay").hide();

        $("#about > a").click(function () {
            $("#overlay").show();
            $("#about > a").hide();
        })
        $("#overlay > a").click(function () {
            $("#overlay").hide();
            $("#about > a").show();
        })
    }
})();
