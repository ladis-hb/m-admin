<template>
  <b-container class="set-devs">
    <b-row>
      <separated title="add devs"></separated>
      <b-col cols="12" sm="6">
        <b-form-group
          label="设备Id:"
          label-for="Devid"
          label-cols="12"
          label-cols-sm="2"
        >
          <b-form-input id="Devid" v-model.trim="Devid"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="4">
        <b-form-group
          label="设备类型:"
          lable-for="DevType"
          label-cols="12"
          label-cols-sm="3"
        >
          <b-form-select v-model="DevType" :options="DevTypes"> </b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="12" sm="2">
        <b-button variant="info" block @click="addDevid">Sumbit</b-button>
      </b-col>
    </b-row>
    <b-row>
      <separated title="dev list"></separated>
      <b-col cols="12" class="table-mx overflow-auto">
        <b-table
          :items="Dev_list"
          :fields="fields"
          hover
          sticky-header
          head-variant="dark"
          Borderless
          selectable
          select-mode="multi"
          selected-variant="info"
          @row-selected="onRowSelected"
        >
        </b-table>
      </b-col>
      <b-button class="mx-4" @click="Del_select_items">删除所选</b-button
      ><b-button variant="info" class="mx-4" @click="Modify_select_items"
        >修改别名</b-button
      >
    </b-row>
  </b-container>
</template>

<script>
import {
  addDevid,
  delete_Devid,
  Modify_devName,
  Get_devid_list
} from "../../util/axios";
import { mapGetters, mapState } from "vuex";
import { MessageBox, Message } from "element-ui";
import separated from "../../components/separated";
export default {
  data() {
    return {
      Devid: "",
      DevType: "",
      DevTypes: [
        { value: "ups", text: "UPS" },
        { value: "ac", text: "AC" },
        { value: "power", text: "POWER" },
        { value: "io", text: "IO" },
        { value: "th", text: "TH" }
      ],
      Dev_list: [],
      fields: [
        { key: "type", label: "类型", sortable: true },
        { key: "devName", label: "别名" },
        { key: "devid", label: "设备Id" }
      ],
      Select_items: []
    };
  },
  components: {
    separated
  },
  computed: {
    ...mapGetters(["lang"]),
    ...mapState(["user", "token"])
  },
  methods: {
    addDevid() {
      let { Devid, DevType } = this.$data;
      if (Devid == "" || DevType == "") return MessageBox.alert("参数不能为空");
      addDevid({
        devid: Devid,
        devType: DevType,
        user: this.user,
        token: this.token
      })
        .then(({ data: { code, msg } }) => {
          if (code != 200) return MessageBox(msg, "tip");
          Message(msg);
          this.Devid = "";
          this.Get_user_all_devs();
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    },
    /* devslist触发事件，获取选中的option，允许多选 */
    onRowSelected(item) {
      this.Select_items = item;
    },
    Del_select_items() {
      let items_devsid = this.Select_items.map(val => {
        return val.devid;
      });
      MessageBox.confirm(
        `是否要删除设备：${items_devsid.join("/")}`,
        "删除设备",
        {
          type: "warning"
        }
      )
        .then(() => {
          for (let id of items_devsid) {
            this.delete_Devid(id);
          }
          this.Get_user_all_devs();
        })
        .catch(() => {
          Message("取消删除");
        });
    },
    Modify_select_items() {
      let items = this.Select_items[0];
      if (!items) return Message("请选择需要修改的设备/单选");
      let { devid, devName } = items;
      MessageBox.prompt("别名:", "修改别名", {
        inputValue: devName
      }).then(({ value }) => {
        let arg = { user: this.user, token: this.token, devid, devName: value };
        Modify_devName(arg)
          .then(({ data: { code, msg } }) => {
            if (code != 200) return MessageBox(msg, "tip");
            this.Get_user_all_devs();
            return Message("modify devName success");
          })
          .catch(err => {
            MessageBox(err, "error-settingMain");
          });
      });
    },
    Get_user_all_devs() {
      Get_devid_list().then(result => {
        let { code, data } = result.data;
        if (code != 200) return;
        this.Dev_list = data.dev;
      });
    },
    delete_Devid(devid) {
      delete_Devid({ user: this.user, token: this.token, devid })
        .then(() => {
          Message(`删除了设备${devid}`);
        })
        .catch(err => {
          MessageBox.alert(err, "error");
        });
    }
  },

  mounted() {
    this.Get_user_all_devs();
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 375px) {
  .set-devs {
    margin: 0px;
    padding: 0px;
  }
}
.table-mx {
  max-height: 400px;
}
</style>
