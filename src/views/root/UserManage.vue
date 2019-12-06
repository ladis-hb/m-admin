<template>
  <b-row>
    <b-col cols="12">
      <separated :title="$t('root.UserManage.3tq6gn')"></separated>
      <b-table
        ref="userListTable"
        :items="Users"
        :fields="user_fields"
        hover
        head-variant="dark"
        primary-key="generateTime"
        sticky-header="700px"
        selectable
        selected-variant="primary"
        select-mode="single"
        @row-clicked="onRowSelected"
        :tbody-tr-class="rowClass"
      >
        <template v-slot:cell(creatTime)="data">
          <b>{{ $d(new Date(data.value), "long") }}</b>
        </template>
        <template v-slot:cell(modifyTime)="data">
          <b>{{ data.value ? $d(new Date(data.value), "long") : "" }}</b>
        </template>
        <template v-slot:cell(status)="data">
          {{
            data.value
              ? $t("root.UserManage.czy5jd")
              : $t("root.UserManage.aqlz8e")
          }}
        </template>
      </b-table>
    </b-col>
    <b-col cols="12">
      <b-button-group>
        <b-button variant="info" v-b-modal.modal-1>{{
          $t("root.UserManage.xfnd5o")
        }}</b-button>
        <b-button variant="warning" @click="disable_select_user">
          {{
            !select_item.status
              ? $t("root.UserManage.czy5jd")
              : $t("root.UserManage.aqlz8e")
          }}{{ $t("root.UserManage.ck6r6a") }}
        </b-button>
        <b-button variant="primary" @click="delete_select_user">{{
          $t("root.UserManage.zj504r")
        }}</b-button>
      </b-button-group>
      <b-modal
        id="modal-1"
        :title="$t('root.UserManage.5oezer')"
        @ok="modify_select_user"
      >
        <b-form>
          <b-form-group
            :label="$t('root.UserManage.jwwcln')"
            label-for="name"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-input id="name" v-model="select_item.name"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('root.UserManage.zibwmr')"
            label-for="mail"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-input id="mail" v-model="select_item.mail"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('root.UserManage.bzc1np')"
            label-for="tel"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-input id="tel" v-model="select_item.tel"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('root.UserManage.wft2tk')"
            label-for="compony"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-input
              id="compony"
              v-model="select_item.orgin"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('root.UserManage.w9mipe')"
            label-for="userGroup"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-select
              id="userGroup"
              v-model="select_item.userGroup"
              :options="{ user: 'user' }"
            ></b-form-select>
          </b-form-group>
        </b-form>
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import separated from "../../components/separated";
import gql from "graphql-tag";
export default {
  data() {
    return {
      Users: [],
      user_fields: [
        {
          key: "status",
          label: this.$t("root.UserManage.9swcfu"),
          sortable: true,
          variant: "info"
        },
        { key: "user", label: this.$t("root.UserManage.lm2jra") },
        { key: "name", label: this.$t("root.UserManage.qcy4wu") },
        { key: "mail", label: this.$t("root.UserManage.es63r7") },
        { key: "tel", label: this.$t("root.UserManage.xwyua9") },
        { key: "orgin", label: this.$t("root.UserManage.y53ith") },
        { key: "userGroup", label: this.$t("root.UserManage.zlzuz3") },
        {
          key: "creatTime",
          label: this.$t("root.UserManage.smy9cj"),
          sortable: true
        },
        { key: "modifyTime", label: this.$t("root.UserManage.7wvamv") }
      ],
      select_item: {},
      select_index: 0
    };
  },
  components: {
    separated
  },
  apollo: {
    Users: {
      query: gql`
        query getAllUserInfo {
          Users {
            name
            user
            userGroup
            mail
            orgin
            tel
            creatTime
            modifyTime
            status
          }
        }
      `
    }
  },
  methods: {
    onRowSelected(item, index) {
      this.select_item = item;
      this.select_index = index;
    },
    rowClass(item) {
      if (!item) return;
      if (!item.status) return "table-warning";
    },
    modify_select_user() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($user: String) {
              modify_select_user(user: $user) {
                ok
                msg
              }
            }
          `,
          variables: {
            user: JSON.stringify(this.select_item)
          }
        })
        .then(data => {
          this.$apollo.queries.Users.refetch();
          this.$MessageBox(
            data.data.modify_select_user.msg || "success",
            "tip"
          );
        });
    },
    disable_select_user() {
      let { status, user } = this.select_item;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation disable_select_user($user: String, $status: Boolean) {
              disable_select_user(user: $user, status: $status) {
                ok
                msg
              }
            }
          `,
          variables: {
            user,
            status: !status
          }
        })
        .then(data => {
          this.$apollo.queries.Users.refetch();
          this.$MessageBox(
            data.data.disable_select_user.msg || "success",
            "tip"
          );
        });
    },
    delete_select_user() {
      let { user, name } = this.select_item;
      this.$MessageBox
        .confirm(`确定要删除用户：< ${user}|${name} >吗?`, "delete user")
        .then(() => {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation delete_select_user($user: String) {
                  delete_select_user(user: $user) {
                    ok
                    msg
                  }
                }
              `,
              variables: {
                user
              }
            })
            .then(data => {
              this.$apollo.queries.Users.refetch();
              this.$MessageBox(
                data.data.delete_select_user.msg || "success",
                "tip"
              );
            });
          /* delete_select_user({
          selectUser: user
        })
          .then(({ data: { code, msg } }) => {
            if (code != 200) return MessageBox(msg, "tip");
            this.Get_User_list();
          })
          .catch(err => {
            MessageBox(err, "error");
          }); */
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
