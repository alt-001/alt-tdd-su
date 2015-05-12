alt.controller 'authCtrl', ($scope, $location, auth) ->
  $scope.login = ->
    auth.login($scope.user).then (data) ->
      $location.path '/'
    return
  $scope.logout = ->
    auth.logout()
    return
  $scope.register = ->
    auth.register($scope.user).then (data) ->
      auth.storeUserInfo($scope.user, data)
      $location.path '/'
    return