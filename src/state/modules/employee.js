import axios from 'axios'
export const state = {
    employees: []
};
export const getters = {
    employeesList: (state) => state.employees,
};
export  const actions = {
    async fetchEmployees({commit}) {
        axios.get(" http://127.0.0.1:8000/api/employees").then(response => {
            commit('setEmployees', response.data)
            //this.$store.dispatch("toggleOffLoading");
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        })
    },

    async addEmployee({commit}, Employee){
        axios.post(" http://127.0.0.1:8000/api/employee/create", Employee).then(response => {
            commit("addNewEmployee", response.data)
        }).catch(e => {
            console.log(e);
        })
    },

    async deleteEmployee({commit}, id){
        axios.delete(`http://127.0.0.1:8000/employee/delete/${id}`).then(response => {
            commit("removeEmployee", response.data)
        }).catch(e => {
            console.log(e);
        })
    },

};
export const mutations = {
    setEmployees: (state, employees) => (
        state.employees = employees
    ),
    addNewEmployee: (state, employee) => state.employees.unshift(employee),
    removeEmployee: (state, id) => (
        state.users.filter(employee => employee.id !== id),
            state.users.splice(employee => employee.id, 1)
    )
};
