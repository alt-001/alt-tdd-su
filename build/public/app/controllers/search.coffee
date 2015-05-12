alt.controller 'searchCtrl', ($scope, $routeParams, $location, products) ->
  $scope.products = products.products()

  $scope.section = $routeParams.section
  $scope.query = $location.search().target;