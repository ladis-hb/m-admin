<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <b-card class="m-4 text-center">
          <b-card-body
            :title="$t('Device.IO.t1c5l9')"
            :sub-title="$t('Device.IO.lso2xm')"
          >
            <div>
              <b-button
                pill
                :variant="Smoke"
                class="m-2"
                @click="show = true"
                >{{ $t("Device.IO.i9l7f9") }}</b-button
              >
              <b-button pill :variant="Leak" class="m-2" @click="show = true">{{
                $t("Device.IO.vhi9h8")
              }}</b-button>
              <b-button
                pill
                :variant="access_contral"
                class="m-2"
                @click="show = true"
                >{{ $t("Device.IO.4xqfbb") }}</b-button
              >
              <b-button pill variant="success" class="m-2">{{
                $t("Device.IO.upanj4")
              }}</b-button>
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
import { mapState } from "vuex";
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
    language() {
      return this.$store.getters.language(this.$i18n.locale);
    },
    ...mapState(["dev"]),
    IO() {
      let io = Object.values(this.dev.io);
      return io[0] ? io[0] : false;
    },
    Smoke() {
      if (!this.IO) return;
      return this.IO.smoke === this.final.smoke ? "success" : "danger";
    },
    Leak() {
      if (!this.IO) return;
      return this.IO.leak === this.final.leak ? "success" : "danger";
    },
    access_contral() {
      if (!this.IO) return;
      return this.IO.access_contral === this.final.access_contral
        ? "success"
        : "danger";
    }
  },
  methods: {
    SetFinal() {
      this.show = false;
      Setfinal({ final: this.final }).then(
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
      //console.log(this.control);

      switch (c) {
        case "a":
          break;
      }
    }
  },
  //进入组件钩子
  activated() {
    Getfinal().then(({ data: { code, msg, data: result } }) => {
      if (code != 200) return MessageBox.alert(msg);
      this.final = Object.assign(this.final, result);
    });
  }
};
</script>

<style lang="scss" scoped></style>
