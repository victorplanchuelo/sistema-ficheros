<template>
    <div>
        <div  v-if="isLoaded">
            Fichajes para ADMIN
        </div>
        
        <md-dialog-alert
            :md-active.sync="notAuthorized"
            md-content="No estás autorizado a ver esta página"
            md-confirm-text="Cerrar" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            isLoaded: false,
            notAuthorized: false,
            intAlert: 0,
        }
    },
    props: {
        username: String,
        user: Object
    },
    created() {
        if(this.user.fichajes.debe_fichar)
        {
            this.notAuthorized = true
            this.intAlert = setInterval(this.closeNotAuthorizedAlert, 1000)
        }
        else {
            this.isLoaded = true
        }
    },
    methods: {
        closeNotAuthorizedAlert() {
            if(!this.notAuthorized)
            {
                clearInterval(this.intAlert)
                this.$router.push('/dashboard')
                .catch(err => { 
                    if (err.name != "NavigationDuplicated") {
                        console.error(err);
                    }
                })
    
            }
        },
    },
}
</script>