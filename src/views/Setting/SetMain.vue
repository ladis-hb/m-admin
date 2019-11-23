<template>
  <b-container class="set-devs">
    <b-row>
      <separated title="添加主机"></separated>
      <b-col cols="12" sm="8">
        <b-form-group
          label="环控主机MacId:"
          label-for="Devid"
          label-cols="12"
          label-cols-sm="2"
        >
          <b-form-input id="Devid" v-model.trim="Devid"></b-form-input>
        </b-form-group>
      </b-col>

      <b-col cols="6" sm="2">
        <b-button variant="info" block @click="addDevid">Add Device</b-button>
      </b-col>
      <b-col cols="6" sm="2">
        <b-button variant="dark" block @click="DeleteDevid"
          >Delete Device</b-button
        >
      </b-col>
    </b-row>
    <b-row>
      <separated title="主机设备清单"></separated>
      <b-col cols="12" class="table-mx">
        <b-list-group>
          <b-list-group-item
            v-for="(client, key) in Dev_list"
            :key="key"
            button
            v-b-toggle="client.clientID"
          >
            <i
              >客户端ID：{{ client.clientID }}，设备数量:{{
                client.devlistSrize.length
              }}</i
            >

            <b-collapse :id="client.clientID" visible accordion="my-accordion">
              <b-list-group>
                <b-list-group-item
                  v-for="(devs, key) in client.devlistSrize"
                  :key="key"
                >
                  <p>设备类型:{{ devs.devType }}</p>
                  <p>设备名称:{{ devs.devName }}</p>
                  <p>设备ID：{{ devs.devid }}</p>
                </b-list-group-item>
              </b-list-group>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  addDevid,
  delete_Devid,
  //Modify_devName,
  Get_devid_list
} from "../../util/axios";
import { mapGetters, mapState } from "vuex";
import { MessageBox, Message } from "element-ui";
import separated from "../../components/separated";
export default {
  data() {
    return {
      Devid: "",
      Dev_list: [],
      fields: [
        { key: "type", label: "类型", sortable: true },
        { key: "devName", label: "别名" },
        { key: "devid", label: "设备Id" }
      ]
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
      let { Devid } = this.$data;
      if (Devid == "") return MessageBox.alert("参数不能为空");
      addDevid({
        devid: Devid
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
    DeleteDevid() {
      let { Devid } = this.$data;
      let all = this.Dev_list.map(el => {
        return el.clientID;
      });

      if (Devid == "" || !all.includes(Devid))
        return MessageBox.alert("参数不能为空或不存在的设备号");
      this.$MessageBox(`是否需要删除设备${Devid}?`, "Delete Device").then(
        () => {
          delete_Devid({
            devid: Devid
          }).then(({ data: { code, msg } }) => {
            if (code != 200) return MessageBox(msg, "tip");
            return this.$Message(msg);
          });
        }
      );
    },
    /* Modify_select_items() {
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
    }, */
    Get_user_all_devs() {
      Get_devid_list().then(result => {
        let { code, data } = result.data;
        if (code != 200) return;
        this.Dev_list = data;
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
