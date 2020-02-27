<template>
    <nav id="navbar" class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <!--<button class="btn btn-primary" id="menu-toggle">Toggle Menu</button>-->
        <button type="button" id="menu-toggle" class="btn btn-primary"></button>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown
              </a>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
</template>

<script>
export default {
    mounted() {
        window.$("#menu-toggle").click(function() {
            window.$("#sidebar, #navbar").toggleClass("active");
        });
    }
}
</script>

<style scoped>
    @import 'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900';
    @import 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';


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
</style>