<template>
  <nav id="navbar" class="navbar navbar-expand-md navbar-dark bg-dark p-0">
    <button type="button" id="menu-toggle" class="btn btn-primary"></button>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-header">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse collapse justify-content-stretch" id="navbar-header">
        <ul class="navbar-nav ml-auto">
            <!--<li class="nav-item">
                <a class="nav-link" href="#">Link</a>
            </li>-->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img data-v-5e628c52="" :src="avatar" alt="avatar image" class="img-fluid rounded-circle z-depth-0" style="height: 35px;">
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Editar perfil</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click="logoutUser">Desconectar</a>
              </div>
            </li>
        </ul>
    </div>
  </nav>
</template>

<script>
export default {
    props: {
      user: Object
    },
    computed: {
      avatar() {
        return this.$store.getters['users/getAvatar'];
      }
    },
    mounted() {
        window.$("#menu-toggle").click(function() {
            window.$("#sidebar, #navbar").toggleClass("active");
        });
    },
    methods: {
      logoutUser() {
          this.$store.commit('auth/logoutUser')
      }
    }
}
</script>

<style scoped>
    @import 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900';
    @import 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
    
    #navbar {
      min-height: 61px;
    }

    #navbar.active .btn.btn-primary:before {
      content: "\f054";
      font-family: "FontAwesome";
      left: 2px !important; }
    #navbar.active .btn.btn-primary:after {
      display: none; }

    #navbar .btn.btn-primary {
      background: #2f89fc;
      border-color: transparent;
      position: relative;
      color: #000;
      width: 30px;
      height: 30px; 
    }
    #navbar .btn.btn-primary:after, #navbar .btn.btn-primary:before {
        position: absolute;
        top: 2px;
        left: 0;
        right: 0;
        bottom: 0;
        font-family: "FontAwesome";
        color: #fff; 
    }
    #navbar .btn.btn-primary:after {
        content: "\f053";
        right: 2px; 
    }

    #navbar .avatar {
      height: 35px;
    }

    #navbar .dropdown-item {
      color: black;
    }

    #navbar .dropdown-item:hover {
      text-decoration: none;
      background-color: #BFCF1F;
    }
    
</style>