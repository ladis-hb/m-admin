<template>
  <b-container fluid class="d-flex flex-column h-100">
    <b-row>
      <b-col
        cols="12"
        ref="loginTitle"
        class="loginTitle bg-info d-flex flex-row align-items-center"
      >
        <span class="text-center text-light">Ladis Login pages</span>
      </b-col>
    </b-row>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex align-items-center justify-content-center h-auto"
      >
        <b-card class="shadow">
          <div class=" d-flex flex-row-reverse flex-nowrap" >
              <b-link class=" m-1 ml-2" to="Reset">reset</b-link>
                <b-link class=" m-1 " to="Register">register</b-link>              
              <h4 class=" text-success login-left">login</h4>
          </div>
          <div class>
            <b-form-group
              label="user:"
              label-for="user"
              label-cols="12"
              label-cols-sm="3"
              :state="stateUser"
              :invalid-feedback="invalidFeedback"
            >
              <b-form-input id="user" v-model.trim="user" placeholder="Let us know your name."></b-form-input>
            </b-form-group>
            <b-form-group
              label="Passwd:"
              label-for="passwd"
              label-cols="12"
              label-cols-sm="3"
              description
            >
              <b-form-input
                id="passwd"
                type="password"
                v-model.trim="passwd"
                placeholder="Let us know your passwd."
              ></b-form-input>
            </b-form-group>
            <b-form-group class="p-3">
              <b-button @click="login_submit" block>login</b-button>
            </b-form-group>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      user: "",
      passwd: ""
    };
  },
  computed: {
    stateUser() {
      return false;
    },
    validFeedback() {
      return this.state === true ? "Thank you" : "";
    },
    invalidFeedback() {
      if (this.user.length > 4) {
        return "";
      } else if (this.user.length > 0) {
        return "Enter at least 4 characters";
      } else {
        return "Please enter something";
      }
    }
  },
  methods: {
    login_submit() {}
  }
};
</script>

<style lang='scss' scoped >
.loginTitle {
  height: 60px;
}
.login-left{
    margin-right: auto;
}
</style>
