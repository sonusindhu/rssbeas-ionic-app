angular.module('starter.controllers', [])

        .controller('DashCtrl', function ($scope, $http) {
            
            $scope.LatestVids = function () {
                $http({
                    method: "get",
                    url: 'http://rssbeas.com/api/get_recent_posts?count=10&include=title,date,author,custom_fields,thumbnail',
                    dataType: 'json',
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        $scope.videos = response.data.posts;
                    }
                });
            };
            $scope.LatestVids();

        })
        // schedule controller
        .controller('ScheduleCtrl', function ($scope, $http) {
            $scope.getSchedule = function () {
                $http({
                    method: "get",
                    url: 'http://rssbeas.com/api/get_category_posts?id=1802&count=2&include=title,date,author,custom_fields,content',
                    dataType: 'json',
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        $scope.schedules = response.data.posts;
                    }
                });
            }
            $scope.getSchedule();

        })
        
        .controller('StoriesCtrl', function ($scope, $http) {
            
            $scope.getStories = function () {
                $http({
                    method: "get",
                    url: 'http://rssbeas.com/api/get_category_posts?id=1798&count=10&include=title,date,author,custom_fields,thumbnail',
                    dataType: 'json',
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        $scope.stories = response.data.posts;
                    }
                });
            }
            $scope.getStories();

        })
        
        .controller('Mp3Ctrl', function ($scope, $http) {
            
            $scope.getMp3 = function () {
                $http({
                    method: "get",
                    url: 'http://rssbeas.com/api/get_category_posts?id=31&count=10&include=title,date,author,custom_fields,thumbnail',
                    dataType: 'json',
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        $scope.mp3 = response.data.posts;
                    }
                });
            }
            $scope.getMp3();

        })
        
        .controller('SearchCtrl', function ($scope, $http) {
            $scope.getSearch = function () {
                
            }
            $scope.getSearch();
        })

        .controller('QaCtrl', function ($scope, $http) {
            
            $scope.getQa = function () {
                $http({
                    method: "get",
                    url: 'http://rssbeas.com/api/get_category_posts?id=17&count=10&include=title,date,author,custom_fields,thumbnail',
                    dataType: 'json',
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        $scope.qavids = response.data.posts;
                        console.log("liked");
                    }
                });
            };
            $scope.getQa();
        });
