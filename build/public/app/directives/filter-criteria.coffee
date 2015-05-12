alt.directive 'filterCriteria', ->
  return {
    restrict: 'A',
    scope: 'true',
    controller: ($scope) ->
      $scope.colourIncludes = []
      
      $scope.includeColour = (colour) ->
        i = _.indexOf($scope.colourIncludes, colour)
        if i > -1
          $scope.colourIncludes.splice i, 1
        else
          $scope.colourIncludes.push colour
  }