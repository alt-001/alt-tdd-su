alt.controller 'productsCtrl', ($scope, $location, $route, $routeParams, $rootScope, auth, products) ->
  currentRoute = $location.path().split('/')

  $scope.products = products.products()
  $scope.featuredProducts = products.featuredProducts()

  $scope.addProduct = ->
    products.addProduct $scope
    $scope.name = ''
  $scope.deleteProduct = (productID) ->
    products.deleteProduct productID

  if $rootScope.currentUser.$id != undefined
    $scope.flagProduct = (flagType, productID) ->
      products.flagProduct flagType, productID
  else 
    $location.path '/signup'

  $scope.disflagProduct = (flagType, productID) ->
    products.disflagProduct flagType, productID
    if flagSection == 'loves' || flagSection == 'reserves'
      $route.reload()

  if $routeParams.userID
    products.flaggedProducts(currentRoute[4], $routeParams.userID).then (data) ->
      $scope.flaggedProducts = data

  if $rootScope.currentUser.$id != undefined
    products.currentUserFlaggedProducts('love').$loaded().then (data) ->
      $scope.ifLoved = (productID) ->
        ifLoved = data.$getRecord(productID)
        if ifLoved != null then return true else return false
    products.currentUserFlaggedProducts('reserve').$loaded().then (data) ->
      $scope.ifReserved = (productID) ->
        ifReserved = data.$getRecord(productID)
        if ifReserved != null then return true else return false
