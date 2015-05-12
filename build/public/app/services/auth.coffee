alt.factory 'auth', ($rootScope, FIREBASE_URL, $firebaseAuth, $firebaseObject) ->
  rootRef = new Firebase FIREBASE_URL
  authRef = $firebaseAuth rootRef

  authRef.$onAuth (authUser) ->
    if authUser
      userRef = new Firebase FIREBASE_URL + '/users/' + authUser.uid
      userObj = $firebaseObject userRef
      $rootScope.currentUser = userObj
    else
      $rootScope.currentUser = ''

  output =
    login: (userObj) ->
      authRef.$authWithPassword userObj

    logout: ->
      authRef.$unauth()

    register: (userObj) ->
      authRef.$createUser userObj

    storeUserInfo: (userObj, regUser) ->
      usersRef = new Firebase FIREBASE_URL + '/users'

      userInfo = 
        uid: regUser.uid
        firstname: userObj.firstname
        lastname: userObj.lastname
        email: userObj.email
        date: Firebase.ServerValue.TIMESTAMP

      usersRef.child(regUser.uid).set userInfo, ->
        console.log 'Succeeded'
      return

    requireAuth: ->
      authRef.$requireAuth()

  return output