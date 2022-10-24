
export const state = {
    currentUser: window.localStorage.getItem('auth.currentUser'),
}

export const mutations = {
    SET_CURRENT_USER(state, newValue) {
        state.currentUser = newValue
        saveState('auth.currentUser', newValue)
    },
}


export const getters = {
    // Whether the user is currently logged in.
    loggedIn(state) {
        return !!state.currentUser
    },
    loggedInUser(state){
        return state.currentUser
    }
}

export const actions = {
  setCurrentUser({commit}, user){
      commit('SET_CURRENT_USER', user)
  }
}

// ===
// Private helpers
// ===

function saveState(key, state) {
    window.localStorage.setItem(key, JSON.stringify(state))
}


