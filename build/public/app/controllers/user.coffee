alt.controller 'userCtrl', ($scope, $location, $routeParams, auth, products) ->
  currentRoute = $location.path().split('/')
  $scope.sectionActive = (section) ->
    section == currentRoute[3] ? 'active' : ''
  $scope.subSectionActive = (subSection) ->
    subSection == currentRoute[4] ? 'active' : ''

  $scope.name = 'X Tao'
  $scope.username = 'tao'
  $scope.email = 'taoxh@hotmail.com'
  $scope.gender = 'male'
  $scope.address = '47 Neeld Cresent'
  $scope.fashion = "Men's fashion"
  $scope.category = 'Shoes, T-shirt'
  $scope.colour = 'Red, Blue'
  $scope.brand = 'A, B, C'
  $scope.subscription = 'You have subscribbed to our newsletter and recommendation'