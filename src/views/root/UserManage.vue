<template>
  <b-row>
    <b-col cols="12">
      <separated :title="lang.get('UM')"></separated>
      <b-table
        ref="userListTable"
        :items="user_items"
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
        <template slot="[statu]" slot-scope="data">
          {{ data.item.status ? "启用" : "禁用" }}
        </template>
      </b-table>
    </b-col>
    <b-col cols="12">
      <b-button-group>
        <b-button variant="info" v-b-modal.modal-1>修改用户分组</b-button>
        <b-button variant="warning" @click="disable_select_user"
          >{{ !select_item.status ? "启用" : "禁用" }}用户</b-button
        >
        <b-button variant="primary" @click="delete_select_user"
          >删除用户</b-button
        >
      </b-button-group>
      <b-modal id="modal-1" title="修改用户分组" @ok="modify_select_user">
        <b-form>
          <b-form-group
            :label="lang.get('name')"
            label-for="name"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-input id="name" v-model="select_item.name"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('mail')"
            label-for="mail"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-input id="mail" v-model="select_item.mail"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('tel')"
            label-for="tel"
            label-cols="12"
            label-cols-md="3"
          >
            <b-form-input id="tel" v-model="select_item.tel"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('compony')"
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
            :label="lang.get('userGroup')"
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
import { mapGetters } from "vuex";
import {
  Get_User_list,
  admin_modify_user_info,
  disable_select_user,
  delete_select_user,
  modify_select_user
} from "../../util/axios";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      user_items: [],
      user_fields: [
        {
          key: "statu",
          label: this.lang.get("status"),
          sortable: true,
          variant: "info"
        },
        { key: "user", label: this.lang.get("user") },
        { key: "name", label: this.lang.get("name") },
        { key: "mail", label: this.lang.get("mail") },
        { key: "tel", label: this.lang.get("tel") },
        { key: "orgin", label: this.lang.get("compony") },
        { key: "userGroup", label: this.lang.get("userGroup") },
        {
          key: "creatTime",
          label: this.lang.get("generateTime"),
          sortable: true
        },
        { key: "modifyTime", label: this.lang.get("updatetime") }
      ],
      select_item: {},
      select_index: 0
    };
  },
  components: {
    separated
  },
  computed: {
    ...mapGetters(["lang"])
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
      modify_select_user({
        selectUsers: this.select_item
      })
        .then(({ data: { code, msg } }) => {
          if (code != 200) return MessageBox(msg, "tip");
          this.user_items[this.select_index] = this.select_item;
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    },
    disable_select_user() {
      let { status, user } = this.select_item;
      disable_select_user({
        selectUser: user,
        status: !status
      })
        .then(({ data: { code, msg } }) => {
          if (code != 200) return MessageBox(msg, "tip");
          this.user_items[this.select_index].status = !status;
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    },
    delete_select_user() {
      let { user, name } = this.select_item;
      MessageBox.confirm(
        `确定要删除用户：< ${user}|${name} >吗?`,
        "确认删除？"
      ).then(() => {
        delete_select_user({
          selectUser: user
        })
          .then(({ data: { code, msg } }) => {
            if (code != 200) return MessageBox(msg, "tip");
            this.Get_User_list();
          })
          .catch(err => {
            MessageBox(err, "error");
          });
      });
    },
    Get_User_list() {
      Get_User_list().then(({ data: { code, msg, data } }) => {
        if (code != 200) return MessageBox(msg, "tip");
        this.user_items = data;
      });
    },
    Modify_User_Args() {
      admin_modify_user_info();
    }
  },
  mounted() {
    this.Get_User_list();
  }
};
</script>

<style lang="scss" scoped></style>
