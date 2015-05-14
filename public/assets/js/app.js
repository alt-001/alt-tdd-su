var alt;

alt = angular.module('alt', ['ngResource', 'ngRoute', 'firebase', 'wu.masonry', "ngSanitize", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.poster"]);

alt.constant('FIREBASE_URL', 'https://alt-001.firebaseio.com');

alt.run(function($rootScope, $location) {
  return $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
    if (error === 'AUTH_REQUIRED') {
      $rootScope.message = '';
      return $location.path('/signup');
    }
  });
});

alt.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  return $routeProvider.when('/', {
    templateUrl: 'views/pages/index.html'
  }).when('/signup', {
    templateUrl: 'views/pages/user/signup.html'
  }).when('/info/:section', {
    templateUrl: 'views/pages/info/info.html'
  }).when('/user/:userID/love/loves', {
    templateUrl: 'views/pages/user/loves.html'
  }).when('/user/:userID/love/reserves', {
    templateUrl: 'views/pages/user/reserves.html'
  }).when('/user/:userID/love/follows', {
    templateUrl: 'views/pages/user/follows.html'
  }).when('/user/:userID/profile', {
    templateUrl: 'views/pages/user/profile.html'
  }).when('/brand/:brand/products', {
    templateUrl: 'views/pages/brand/products.html'
  }).when('/brand/:brand/brand', {
    templateUrl: 'views/pages/brand/brand.html'
  }).when('/brand/:brand/inspirations', {
    templateUrl: 'views/pages/brand/inspirations.html'
  }).when('/brand/:brand/traces', {
    templateUrl: 'views/pages/brand/traces.html'
  }).when('/search', {
    templateUrl: 'views/pages/search/search.html'
  }).when('/search/:section', {
    templateUrl: 'views/pages/search/search-section.html'
  }).when('/explore', {
    templateUrl: 'views/pages/explore.html'
  }).when('/admin/products', {
    templateUrl: 'views/pages/admin/products.html',
    resolve: {
      currentAuth: function(auth) {
        return auth.requireAuth();
      }
    }
  }).otherwise({
    redirectTo: '/'
  });
});

alt.controller('authCtrl', function($scope, $location, auth) {
  $scope.login = function() {
    auth.login($scope.user).then(function(data) {
      return $location.path('/');
    });
  };
  $scope.logout = function() {
    auth.logout();
  };
  return $scope.register = function() {
    auth.register($scope.user).then(function(data) {
      auth.storeUserInfo($scope.user, data);
      return $location.path('/');
    });
  };
});

alt.controller('brandCtrl', function($scope, $timeout, $location, $route, $routeParams, $rootScope, $sce, auth, brand, products) {
  $scope.brand = $routeParams.brand;
  if ($scope.brand) {
    $scope.brandData = brand.getBrand($scope.brand);
    $scope.brandChapters = ['products', 'brand', 'inspirations', 'traces'];
    $scope.brandData.on('value', function(data) {
      return $timeout((function() {
        $scope.brandIntro = data.val().intro;
        $scope.brandTitle = data.val().title;
        return $scope.brandStory = '/assets/brands/' + data.val().story;
      }), 0);
    });
    $scope.brandProducts = brand.getBrandProducts($scope.brand);
    $scope.brandInspirations = brand.getBrandInspirations($scope.brand);
    $scope.brandTraces = brand.getBrandTraces($scope.brand);
  }
  if ($rootScope.currentUser.$id !== void 0) {
    $scope.followBrand = function(brandID) {
      return brand.followBrand(brandID);
    };
  } else {
    $location.path('/signup');
  }
  $scope.unfollowBrand = function(brandID) {
    brand.unfollowBrand(brandID);
    return $route.reload();
  };
  if ($routeParams.userID) {
    console.log($routeParams.userID);
    brand.followedBrands($routeParams.userID).then(function(data) {
      return $scope.followedBrands = data;
    });
  }
  if ($rootScope.currentUser.$id !== void 0) {
    brand.currentUserFollowedBrands().$loaded().then(function(data) {
      return $scope.ifFollowed = function(brandID) {
        var ifFollowed;
        ifFollowed = data.$getRecord(brandID);
        if (ifFollowed !== null) {
          return true;
        } else {
          return false;
        }
      };
    });
  }
  return $scope.chapterActive = function(chapter) {
    var currentRoute, ref;
    currentRoute = $location.path().split('/');
    return (ref = chapter === currentRoute[3]) != null ? ref : {
      'active': ''
    };
  };
});

alt.controller('infoCtrl', function($scope, $timeout, $location, $routeParams, $rootScope, $sce, info) {
  $scope.section = $routeParams.section;
  $scope.info = info.getInfo();
  info.getInfoSection($scope.section).child('/title').on('value', function(title) {
    return $timeout((function() {
      $scope.infoTitle = title.val();
      return $scope.infoBody = '/views/pages/info/' + $scope.section + '.html';
    }), 0);
  });
  return $scope.sectionActive = function(section) {
    var currentRoute, ref;
    currentRoute = $location.path().split('/');
    return (ref = section === currentRoute[2]) != null ? ref : {
      'active': ''
    };
  };
});

alt.controller('productsCtrl', function($scope, $location, $route, $routeParams, $rootScope, auth, products) {
  var currentRoute;
  currentRoute = $location.path().split('/');
  $scope.products = products.products();
  $scope.featuredProducts = products.featuredProducts();
  $scope.addProduct = function() {
    products.addProduct($scope);
    return $scope.name = '';
  };
  $scope.deleteProduct = function(productID) {
    return products.deleteProduct(productID);
  };
  if ($rootScope.currentUser.$id !== void 0) {
    $scope.flagProduct = function(flagType, productID) {
      return products.flagProduct(flagType, productID);
    };
  } else {
    $location.path('/signup');
  }
  $scope.disflagProduct = function(flagType, productID) {
    products.disflagProduct(flagType, productID);
    if (flagSection === 'loves' || flagSection === 'reserves') {
      return $route.reload();
    }
  };
  if ($routeParams.userID) {
    products.flaggedProducts(currentRoute[4], $routeParams.userID).then(function(data) {
      return $scope.flaggedProducts = data;
    });
  }
  if ($rootScope.currentUser.$id !== void 0) {
    products.currentUserFlaggedProducts('love').$loaded().then(function(data) {
      return $scope.ifLoved = function(productID) {
        var ifLoved;
        ifLoved = data.$getRecord(productID);
        if (ifLoved !== null) {
          return true;
        } else {
          return false;
        }
      };
    });
    return products.currentUserFlaggedProducts('reserve').$loaded().then(function(data) {
      return $scope.ifReserved = function(productID) {
        var ifReserved;
        ifReserved = data.$getRecord(productID);
        if (ifReserved !== null) {
          return true;
        } else {
          return false;
        }
      };
    });
  }
});

alt.controller('searchCtrl', function($scope, $routeParams, $location, products) {
  $scope.products = products.products();
  $scope.section = $routeParams.section;
  return $scope.query = $location.search().target;
});

alt.controller('userCtrl', function($scope, $location, $routeParams, auth, products) {
  var currentRoute;
  currentRoute = $location.path().split('/');
  $scope.sectionActive = function(section) {
    var ref;
    return (ref = section === currentRoute[3]) != null ? ref : {
      'active': ''
    };
  };
  $scope.subSectionActive = function(subSection) {
    var ref;
    return (ref = subSection === currentRoute[4]) != null ? ref : {
      'active': ''
    };
  };
  $scope.name = 'X Tao';
  $scope.username = 'tao';
  $scope.email = 'taoxh@hotmail.com';
  $scope.gender = 'male';
  $scope.address = '47 Neeld Cresent';
  $scope.fashion = "Men's fashion";
  $scope.category = 'Shoes, T-shirt';
  $scope.colour = 'Red, Blue';
  $scope.brand = 'A, B, C';
  return $scope.subscription = 'You have subscribbed to our newsletter and recommendation';
});

alt.directive('adminProducts', function() {
  return {
    restrict: 'A',
    templateUrl: '/views/directives/admin-products.html',
    scope: true,
    controller: function($scope) {
      $scope.deleting = false;
      $scope.startDelete = function() {
        return $scope.deleting = true;
      };
      return $scope.cancelDelete = function() {
        return $scope.deleting = false;
      };
    }
  };
});

alt.directive('filterCriteria', function() {
  return {
    restrict: 'A',
    scope: 'true',
    controller: function($scope) {
      $scope.colourIncludes = [];
      return $scope.includeColour = function(colour) {
        var i;
        i = _.indexOf($scope.colourIncludes, colour);
        if (i > -1) {
          return $scope.colourIncludes.splice(i, 1);
        } else {
          return $scope.colourIncludes.push(colour);
        }
      };
    }
  };
});



alt.directive('listInspirations', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/list-inspirations.html'
  };
});

alt.directive('fancybox', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $(element).fancybox();
      if (scope.$last) {
        $('.fancybox').fancybox;
      }
    }
  };
});

alt.directive('listProducts', function() {
  return {
    restrict: 'AE',
    transclude: true,
    scope: true,
    templateUrl: '/views/directives/list-products.html'
  };
});

alt.directive('listTraces', function() {
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/list-traces.html'
  };
});

alt.directive('searchResults', function() {
  return {
    restrict: 'A',
    templateUrl: '/views/directives/search-results.html'
  };
});

alt.directive('videoPlayer', function() {
  return {
    restrict: 'A',
    templateUrl: '/views/directives/video-player.html',
    scope: 'true',
    controller: function($scope, $sce, brand) {
      return brand.getBrand($scope.brand).child('videoFile').on('value', function(video) {
        $scope.brandVideo = video.val();
        return brand.getBrand($scope.brand).child('videoPoster').on('value', function(poster) {
          $scope.brandVideoPoster = poster.val();
          return $scope.config = {
            autoHide: true,
            preload: 'none',
            sources: [
              {
                src: $sce.trustAsResourceUrl('/assets/videos/' + $scope.brandVideo),
                type: 'video/mp4'
              }
            ],
            theme: {
              url: 'http://www.videogular.com/styles/themes/default/latest/videogular.css'
            },
            plugins: {
              poster: '/assets/videos/' + $scope.brandVideoPoster
            }
          };
        });
      });
    }
  };
});

alt.filter('colourFilter', function() {
  return function(products, scope) {
    if (scope.colourIncludes.length > 0) {
      return products.filter(function(product) {
        return _.intersection(product.color, scope.colourIncludes).length > 0;
      });
    } else {
      return products;
    }
  };
});

alt.filter('wordsTrunc', function() {
  return function(value, max) {
    if (!value) {
      return '';
    }
    max = parseInt(max, 10);
    if (!max || value.length <= max) {
      return value;
    } else {
      return value.substr(0, max) + ' …';
    }
  };
});

alt.factory('auth', function($rootScope, FIREBASE_URL, $firebaseAuth, $firebaseObject) {
  var authRef, output, rootRef;
  rootRef = new Firebase(FIREBASE_URL);
  authRef = $firebaseAuth(rootRef);
  authRef.$onAuth(function(authUser) {
    var userObj, userRef;
    if (authUser) {
      userRef = new Firebase(FIREBASE_URL + '/users/' + authUser.uid);
      userObj = $firebaseObject(userRef);
      return $rootScope.currentUser = userObj;
    } else {
      return $rootScope.currentUser = '';
    }
  });
  output = {
    login: function(userObj) {
      return authRef.$authWithPassword(userObj);
    },
    logout: function() {
      return authRef.$unauth();
    },
    register: function(userObj) {
      return authRef.$createUser(userObj);
    },
    storeUserInfo: function(userObj, regUser) {
      var userInfo, usersRef;
      usersRef = new Firebase(FIREBASE_URL + '/users');
      userInfo = {
        uid: regUser.uid,
        firstname: userObj.firstname,
        lastname: userObj.lastname,
        email: userObj.email,
        date: Firebase.ServerValue.TIMESTAMP
      };
      usersRef.child(regUser.uid).set(userInfo, function() {
        return console.log('Succeeded');
      });
    },
    requireAuth: function() {
      return authRef.$requireAuth();
    }
  };
  return output;
});

alt.factory('brand', function($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject) {
  var brandsRef, inspirationsRef, output, productsRef, tracesRef, usersRef;
  brandsRef = new Firebase(FIREBASE_URL + '/brands');
  productsRef = new Firebase(FIREBASE_URL + '/products');
  inspirationsRef = new Firebase(FIREBASE_URL + '/inspirations');
  tracesRef = new Firebase(FIREBASE_URL + '/traces');
  usersRef = new Firebase(FIREBASE_URL + '/users');
  output = {
    getBrand: function(brand) {
      return brandsRef.child(brand);
    },
    getBrandProducts: function(brand) {
      return $firebaseArray(productsRef.orderByChild('brand').equalTo(brand));
    },
    getBrandInspirations: function(brand) {
      return $firebaseArray(inspirationsRef.orderByChild('brand').equalTo(brand));
    },
    getBrandTraces: function(brand) {
      return $firebaseArray(tracesRef.orderByChild('brand').equalTo(brand));
    },

    /* Follow brand */
    followBrand: function(brand) {
      var brandFollowedRef, followInfo, followedCountArray, followedCountRef, userFollowsRef;
      brandFollowedRef = brandsRef.child(brand).child('follows');
      followedCountRef = brandsRef.child(brand).child('stats/followsCount');
      followedCountArray = $firebaseArray(brandFollowedRef);
      followInfo = {
        date: Firebase.ServerValue.TIMESTAMP
      };

      /* Collect info about the user who follows this brand */
      brandFollowedRef.child($rootScope.currentUser.$id).set(followInfo, function() {
        console.log('Follow added to brand');
        return followedCountRef.set(followedCountArray.length, function() {
          return console.log('Follows counted');
        });
      });

      /* Collect info about the product which has been loved */
      userFollowsRef = usersRef.child($rootScope.currentUser.$id).child('follows');
      return userFollowsRef.child(brand).set(followInfo, function() {
        return console.log('Follow added to user');
      });
    },
    unfollowBrand: function(brand) {
      var brandFollowedRef, followedCountArray, followedCountRef, followsRefUser;
      brandFollowedRef = brandsRef.child(brand).child('follows');
      followedCountRef = brandsRef.child(brand).child('stats/followsCount');
      followedCountArray = $firebaseArray(brandFollowedRef);

      /* Collect info about the user who follows this brand */
      brandFollowedRef.child($rootScope.currentUser.$id).remove(function() {
        console.log('Follow removed from brand');
        return followedCountRef.set(followedCountArray.length, function() {
          return console.log('Follows counted');
        });
      });

      /* Collect info about the product which has been loved */
      followsRefUser = usersRef.child($rootScope.currentUser.$id).child('follows').child(brand);
      return followsRefUser.remove(function() {
        return console.log('Follow removed from user');
      });
    },
    followedBrands: function(userID) {
      var followedBrands, followedBrandsArray, followedBrandsRef, promise;
      followedBrands = [];
      followedBrandsRef = usersRef.child(userID).child('follows');
      followedBrandsArray = $firebaseArray(followedBrandsRef);
      console.log(followedBrandsArray);
      promise = followedBrandsArray.$loaded(function(data) {
        _.forEach(data, function(snapshot) {
          var followedBrandObj;
          followedBrandObj = $firebaseObject(brandsRef.child(snapshot.$id));
          return followedBrands.push(followedBrandObj);
        });
        return followedBrands;
      });
      return promise;
    },
    currentUserFollowedBrands: function() {
      var currentUserFollowedBrandsRef;
      currentUserFollowedBrandsRef = usersRef.child($rootScope.currentUser.$id).child('follows');
      return $firebaseArray(currentUserFollowedBrandsRef);
    }
  };
  return output;
});

alt.factory('info', function($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject) {
  var infoRef, output;
  infoRef = new Firebase(FIREBASE_URL + '/info');
  output = {
    getInfo: function() {
      return $firebaseArray(infoRef);
    },
    getInfoSection: function(section) {
      return infoRef.child(section);
    }
  };
  return output;
});

alt.factory('products', function($rootScope, FIREBASE_URL, $firebaseArray, $firebaseObject) {
  var output, product, productsRef, usersRef;
  productsRef = new Firebase(FIREBASE_URL + '/products');
  usersRef = new Firebase(FIREBASE_URL + '/users');
  product = function(productID) {
    return $firebaseObject(productsRef.child(productID));
  };
  output = {
    products: function() {
      return $firebaseArray(productsRef);
    },
    product: function(productID) {
      return $firebaseObject(productsRef.child(productID));
    },
    featuredProducts: function() {
      return $firebaseArray(productsRef.orderByChild('featured').equalTo(true));
    },
    addProduct: function(product) {
      var productInfo;
      productInfo = {
        name: product.name,
        date: Firebase.ServerValue.TIMESTAMP
      };
      return productsRef.push(productInfo, function() {
        return console.log('Product added');
      });
    },
    deleteProduct: function(productID) {
      var productRef;
      productRef = productsRef.child(productID);
      return productRef.child('loves').on('value', function(users) {
        if (users.val() !== null) {
          return users.forEach(function(user) {
            usersRef.child(user.key()).child('loves').child(productID).remove(function() {
              return console.log('Love removed from user');
            });
            return productRef.remove(function() {
              return console.log('Product deleted');
            });
          });
        } else {
          return productRef.remove(function() {
            return console.log('Product deleted');
          });
        }
      });
    },
    flagProduct: function(flagType, productID) {
      var flagCountArray, flagCountRef, flagInfo, productFlagRef, userFlagRef;
      productFlagRef = productsRef.child(productID).child(flagType + 's');
      flagCountRef = productsRef.child(productID).child('stats/' + flagType + 'sCount');
      flagCountArray = $firebaseArray(productFlagRef);
      flagInfo = {
        date: Firebase.ServerValue.TIMESTAMP
      };
      productFlagRef.child($rootScope.currentUser.$id).set(flagInfo, function() {
        console.log(flagType + ' added to product');
        return flagCountRef.set(flagCountArray.length, function() {
          return console.log(flagType + ' counted');
        });
      });
      userFlagRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's');
      return userFlagRef.child(productID).set(flagInfo, function() {
        return console.log(flagType + ' added to user');
      });
    },
    disflagProduct: function(flagType, productID) {
      var flagCountArray, flagCountRef, productFlagRef, userFlagRef;
      productFlagRef = productsRef.child(productID).child(flagType + 's');
      flagCountRef = productsRef.child(productID).child('stats/' + flagType + 'sCount');
      flagCountArray = $firebaseArray(productFlagRef);
      productFlagRef.child($rootScope.currentUser.$id).remove(function() {
        console.log(flagType + ' removed from product');
        return flagCountRef.set(flagCountArray.length, function() {
          return console.log(flagType + ' counted');
        });
      });
      userFlagRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's').child(productID);
      return userFlagRef.remove(function() {
        return console.log(flagType + ' removed from user');
      });
    },
    flaggedProducts: function(flagSection, userID) {
      var flaggedProducts, flaggedProductsArray, flaggedProductsRef, promise;
      flaggedProducts = [];
      flaggedProductsRef = usersRef.child(userID).child(flagSection);
      flaggedProductsArray = $firebaseArray(flaggedProductsRef);
      promise = flaggedProductsArray.$loaded(function(data) {
        _.forEach(data, function(snapshot) {
          var flaggedProductObj;
          flaggedProductObj = $firebaseObject(productsRef.child(snapshot.$id));
          return flaggedProducts.push(flaggedProductObj);
        });
        return flaggedProducts;
      });
      return promise;
    },
    currentUserFlaggedProducts: function(flagType) {
      var currentUserFlaggedProductsRef;
      currentUserFlaggedProductsRef = usersRef.child($rootScope.currentUser.$id).child(flagType + 's');
      return $firebaseArray(currentUserFlaggedProductsRef);
    }
  };
  return output;
});


