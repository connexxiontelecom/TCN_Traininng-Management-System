
export const state = {
    isLoading:true
};
export const getters = {
    isLoading: state => state.isLoading,
};
export  const actions = {
    isLoadingComplete({commit}){
        commit("toggleOffLoading",false)
    }
};
export const mutations = {
    toggleOffLoading: (state, isloading) => (
        state.isLoading = isloading
    ),

};
