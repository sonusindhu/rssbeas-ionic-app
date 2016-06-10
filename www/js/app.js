// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

        .run(function ($ionicPlatform, $rootScope, $ionicLoading) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

            });



            // for loader
            $rootScope.$on('loading:show', function () {
                $ionicLoading.show({template: '<ion-spinner icon="spiral"/>'});
            });
            $rootScope.$on('loading:hide', function () {
                $ionicLoading.hide();
            });



        })

        .controller('AppCtrl', function ($scope, $ionicModal, $ionicModal, $http, $sce, $ionicHistory) {
            $scope.videos = {};
            $scope.schedules = {};
            $scope.mp3 = {};
            $scope.qavids = {};
            $scope.stories = {};
            $scope.searches = {};

            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };

            $scope.searchAll = function (searchkey) {
                $scope.searches = {};
                $http({
                    method: "get",
                    url: "http://rssbeas.com/api/get_search_results?count=10include=title,date,author,custom_fields,thumbnail&s=" + searchkey,
                    dataType: 'json',
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        $scope.searches = response.data.posts;
                    }
                });
            };

            $scope.loadMore = function (url, type, page) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $http({
                    method: "get",
                    url: url + "&page=" + page,
                    dataType: 'json',
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        switch (type) {
                            case 'home':
                                if ($scope.videos.posts) {
                                    $scope.videos = $scope.videos.posts.concat(response.data.posts);
                                } else {
                                    $scope.videos = response.data;
                                }
                                $scope.videos.page = page;
                                break;
                            case 'schedule':
                                $scope.schedule = $scope.schedule.posts.concat(response.data.posts);
                                break;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                });
                return false;
            };



            $ionicModal.fromTemplateUrl('templates/watch-modal.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function (id) {
                $http({
                    method: "get",
                    url: 'http://rssbeas.com/api/get_post?include=title,date,author,custom_fields,thumbnail,content&id=' + id,
                    dataType: 'json'
                }).then(function (response) {
                    if (response.data.status == 'ok') {
                        if (response.data.post.custom_fields.dp_video_url !== undefined) {
                            var video_id = response.data.post.custom_fields.dp_video_url[0].split('v=')[1];
                            var ampersandPosition = video_id.indexOf('&');
                            if (ampersandPosition != -1) {
                                video_id = video_id.substring(0, ampersandPosition);
                            }
                            $scope.videoplay = $sce.trustAsHtml('<iframe id="player" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/' + video_id + '?enablejsapi=1" frameborder="0"></iframe>');
                        }
                        else if (response.data.post.custom_fields.dp_video_code !== undefined) {
                            $scope.videoplay = $sce.trustAsHtml(response.data.post.custom_fields.dp_video_code[0]);
                        }
                        else if (response.data.post.custom_fields.dp_video_file !== undefined) {
                            $scope.videoplay = $sce.trustAsHtml('<video width="320" height="240" autoplay> <source src="' + response.data.post.custom_fields.dp_video_file[0] + '" type="video/mp4">  Your browser does not support the video tag.</video>');
                        } else {
                            $scope.videoplay = response.data.post.content;
                        }
                        $scope.details = response.data.post;
                        $scope.modal.show();
                    }
                });
                return false;
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };


            $ionicModal.fromTemplateUrl('templates/story-modal.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modalStory = modal;
            });

            $scope.openStoryModal = function () {
                $scope.modalStory.show();
            };
            $scope.closeStoryModal = function () {
                $scope.modalStory.hide();
            };


            $scope.sendFeedback= function(newstory) {
                 alert("ok");
                if(window.plugins && window.plugins.emailComposer) {
                    window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                        console.log("Response -> " + result);
                    }, 
                    newstory.title, // Subject
                    newstory.fullstory,                      // Body
                    ["sonupnf@gmail.com"],    // To
                    null,                    // CC
                    null,                    // BCC
                    true,                   // isHTML
                    null,                    // Attachments
                    null);                   // Attachment Data
                }else{
                    console.log("plugin not found ");
                }
            };


        })

        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

            $ionicConfigProvider.tabs.position('bottom'); // other values: top

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                    // setup an abstract state for the tabs directive
                    .state('tab', {
                        url: '/tab',
                        abstract: true,
                        templateUrl: 'templates/tabs.html'
                    })

                    // Each tab has its own nav history stack:

                    .state('tab.dash', {
                        url: '/dash',
                        views: {
                            'tab-dash': {
                                templateUrl: 'templates/tab-dash.html',
                                controller: 'DashCtrl'
                            }
                        }
                    })

                    .state('tab.qa', {
                        url: '/qa',
                        views: {
                            'tab-qa': {
                                templateUrl: 'templates/tab-qa.html',
                                controller: 'QaCtrl'
                            }
                        }
                    })
                    .state('tab.schedule', {
                        url: '/schedule',
                        views: {
                            'tab-schedule': {
                                templateUrl: 'templates/tab-schedule.html',
                                controller: 'ScheduleCtrl'
                            }
                        }
                    })
                    .state('tab.stories', {
                        url: '/stories',
                        views: {
                            'tab-stories': {
                                templateUrl: 'templates/tab-stories.html',
                                controller: 'StoriesCtrl'
                            }
                        }
                    })
                    .state('tab.mp3', {
                        url: '/mp3',
                        views: {
                            'tab-mp3': {
                                templateUrl: 'templates/tab-mp3.html',
                                controller: 'Mp3Ctrl'
                            }
                        }
                    })
                    .state('tab.search', {
                        url: '/search',
                        views: {
                            'tab-search': {
                                templateUrl: 'templates/tab-search.html',
                                controller: 'SearchCtrl'
                            }
                        }
                    })



            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/tab/dash');


            $httpProvider.interceptors.push(function ($rootScope, $injector, $q) {
                return {
                    request: function (config) {
                        $rootScope.$broadcast('loading:show');
                        return config
                    },
                    response: function (response) {
                        var $http = $http || $injector.get('$http');
                        if ($http.pendingRequests.length < 1) {
                            $rootScope.$broadcast('loading:hide');
                        }
                        return response;
                    },
                    requestError: function (rejectReason) {
                        $rootScope.$broadcast('loading:hide');
                        return $q.reject(rejectReason);
                    },
                    responseError: function (rejectReason) {
                        $rootScope.$broadcast('loading:hide');
                        return $q.reject(rejectReason);
                    }
                }
            });


        });
