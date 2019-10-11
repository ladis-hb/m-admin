<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-card class="m-4 text-center">
          <b-card-body
            title="IO状态"
            sub-title="绿色状态正常，红色状态异常，客户可自由配置状态量，默认烟雾常开，漏水常开，门磁常闭。"
          >
            <div>
              <b-button pill :variant="Smoke" class="m-2" @click="show = true"
                >烟雾</b-button
              >
              <b-button pill :variant="Leak" class="m-2" @click="show = true"
                >漏水</b-button
              >
              <b-button
                pill
                :variant="access_contral"
                class="m-2"
                @click="show = true"
                >门磁</b-button
              >
              <b-button pill variant="success" class="m-2">其他</b-button>
            </div>
            <div>
              <section
                class=" border rounded-lg py-3 d-flex flex-row justify-content-center flex-wrap"
              >
                <div class=" d-flex flex-column  m-2">
                  <span
                    ><b-button
                      pill
                      :variant="control.a ? 'success' : ''"
                      class="mr-1"
                      @click="setControl('a')"
                      >开</b-button
                    ><b-button
                      pill
                      :variant="!control.a ? 'success' : ''"
                      @click="setControl('a')"
                      >关</b-button
                    ></span
                  >
                  <b>门控制</b>
                </div>
                <div class=" d-flex flex-column  m-2">
                  <span
                    ><b-button
                      pill
                      :variant="control.b ? 'success' : ''"
                      class="mr-1"
                      @click="setControl('b')"
                      >开</b-button
                    ><b-button
                      pill
                      :variant="!control.b ? 'success' : ''"
                      @click="setControl('b')"
                      >关</b-button
                    ></span
                  >
                  <b>天窗控制</b>
                </div>

                <div class=" d-flex flex-column  m-2">
                  <span
                    ><b-button
                      pill
                      :variant="control.c ? 'success' : ''"
                      class="mr-1"
                      @click="setControl('c')"
                      >开</b-button
                    ><b-button
                      pill
                      :variant="!control.c ? 'success' : ''"
                      @click="setControl('c')"
                      >关</b-button
                    ></span
                  >
                  <b>空调控制</b>
                </div>
                <div class=" d-flex flex-column  m-2">
                  <span
                    ><b-button
                      pill
                      :variant="control.d ? 'success' : ''"
                      class="mr-1"
                      @click="setControl('d')"
                      >开</b-button
                    ><b-button
                      pill
                      :variant="!control.d ? 'success' : ''"
                      @click="setControl('d')"
                      >关</b-button
                    ></span
                  >
                  <b>插座控制</b>
                </div>
              </section>
            </div>
          </b-card-body>
        </b-card>
        <b-modal v-model="show" id="modal-1" title="修改IO状态常量">
          <b-form-group label="烟雾常量">
            <b-form-radio-group v-model="final.smoke">
              <b-form-radio :value="true">常开</b-form-radio>
              <b-form-radio :value="false">常闭</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group label="漏水常量">
            <b-form-radio-group v-model="final.leak">
              <b-form-radio :value="true">常开</b-form-radio>
              <b-form-radio :value="false">常闭</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group label="门磁常量">
            <b-form-radio-group v-model="final.access_contral">
              <b-form-radio :value="true">常开</b-form-radio>
              <b-form-radio :value="false">常闭</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <b-form-group label="告警设置">
            <b-form-radio-group v-model="final.IO_alarm">
              <b-form-radio :value="true">打开</b-form-radio>
              <b-form-radio :value="false">关闭</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <template v-slot:modal-footer>
            <b-button variant="danger" @click="show = false">取消</b-button>
            <b-button variant="success" @click="SetFinal">确定</b-button>
          </template>
        </b-modal>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Setfinal, Getfinal } from "../../util/axios";
import { MessageBox } from "element-ui";
export default {
  data() {
    return {
      show: false,
      final: {
        smoke: false,
        leak: true,
        access_contral: false,
        IO_alarm: false,
        source_local: true
      },
      control: {
        a: false,
        b: true,
        c: true,
        d: false
      }
    };
  },
  computed: {
    ...mapGetters(["lang", "unit"]),
    ...mapState(["dev", "user", "token"]),
    IO() {
      let io = Object.values(this.dev.io);
      console.log(io);

      if (io[0]) return io[0];
      else return false;
    },
    Smoke() {
      if (!this.IO) return "success";
      let devData = this.IO.smoke;
      let localData = this.final.smoke;

      if (devData == localData) return "success";
      else return "danger";
    },
    Leak() {
      if (!this.IO) return "success";
      let devData = this.IO.leak;
      let localData = this.final.leak;

      if (devData == localData) return "success";
      else return "danger";
    },
    access_contral() {
      if (!this.IO) return "success";
      let devData = this.IO.access_contral;
      let localData = this.final.access_contral;

      if (devData == localData) return "success";
      else return "danger";
    }
  },
  components: {},
  methods: {
    SetFinal() {
      this.show = false;
      Setfinal({ user: this.user, token: this.token, final: this.final }).then(
        ({ data: { code, msg, data: result } }) => {
          if (code != 200) return MessageBox.alert(msg, code);
          let { nModified } = result;
          if (nModified == 0) return MessageBox.alert("已写入用户配置");
          else return MessageBox("已修改用户配置");
        }
      );
    },
    setControl(c) {
      this.control[c] = !this.control[c];
      console.log(this.control);

      switch (c) {
        case "a":
          break;
      }
    }
  },
  //进入组件钩子
  activated() {
    Getfinal({ user: this.user, token: this.token }).then(
      ({ data: { code, msg, data: result } }) => {
        if (code != 200) return MessageBox.alert(msg);
        this.final = Object.assign(this.final, result);
      }
    );
  }
};
</script>

<style lang="scss" scoped></style>
