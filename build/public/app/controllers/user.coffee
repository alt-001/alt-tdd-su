alt.controller 'userCtrl', ($scope, $location, $routeParams, auth, products) ->
  currentRoute = $location.path().split('/')
  $scope.sectionActive = (section) ->
    section == currentRoute[3] ? 'active' : ''
  $scope.subSectionActive = (subSection) ->
    subSection == currentRoute[4] ? 'active' : ''