var customMixins = {
    created: function () {

    },
    methods: {
        processing(){
            this.isBusy = true;
            if(this.isError){
                this.clearError();
            }
            if(this.isSuccess)
            {
                this.clearSuccess();
            }
        },
        completed(){
            this.isBusy = false;
        },

        notifyError(){
            this.isError= true;
        },

        notifyLoadingError(){
            this.isLoadingError= true;
        },

        loadComplete(){
            this.isLoading = false;
        },

        notifySuccess(){
            this.isSuccess = true;
        },

        clearError(){
            this.isError = false
        },

        clearSuccess(){
            this.isSuccess = false
        },

        showError(data)
        {
            this.errorMsg = data;
        },
        showSuccess(data)
        {
            this.successMsg = data;
        },
        baserul(){
           return 'http://127.0.0.1:8000/api';
        }
    },
    data:{
        base_url:'http://127.0.0.1:8000/api',
    }
}

export default customMixins;