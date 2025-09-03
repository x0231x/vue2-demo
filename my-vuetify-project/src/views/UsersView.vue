<template>
  <v-container>
    <div class="d-flex flex-column">
      <div class="text-h4 mb-4">使用者列表</div>
      <v-data-table :headers="headers" :items="rows" class="elevation-1">
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="item.role === 'Admin' ? 'indigo' : 'grey'"
            class="ma-2"
            small
            dark
            >{{ item.role }}</v-chip
          >
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn color="red" class="ma-2" @click="editUser(item)">編輯</v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- 編輯對話框 -->
    <v-dialog v-model="dlg" max-width="480">
      <v-card>
        <v-card-title>編輯使用者</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="draft.name"
              :rules="nameRules"
              label="姓名*"
              prepend-icon="mdi-account"
            />
            <v-text-field
              v-model="draft.email"
              :rules="emailRules"
              label="Email*"
              prepend-icon="mdi-email"
            />
            <v-select
              v-model="draft.role"
              :items="roles"
              :rules="roleRules"
              label="角色*"
              prepend-icon="mdi-account-badge"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancel">取消</v-btn>
          <v-btn color="primary" @click="save">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 成功提示 -->
    <v-snackbar v-model="ok" timeout="1600">已更新</v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { users as seed, roles as roleOptions } from "@/domain/users";
import { User, Role } from "@/types/user";

// 驗證函式型別：輸入 T，回 true（通過）或錯誤訊息
type RuleFn<T> = (v: T) => boolean | string;

export default Vue.extend({
  name: "UsersView",
  data() {
    return {
      headers: [
        { text: "姓名", value: "name" },
        { text: "Email", value: "email" },
        { text: "角色", value: "role" },
        { text: "操作", value: "actions", sortable: false },
      ],
      rows: [...seed] as User[],
      // 角色清單提供給 v-select
      roles: roleOptions as Role[],

      // 草稿，role 一開始可為 null（尚未選）
      draft: {
        id: 0,
        name: "",
        email: "",
        role: null as Role | null,
      } as User & { role: Role | null },

      // 把規則做成變數（並且打型別）
      roleRules: [
        (v: Role | null) => !!v || "請選擇角色",
      ] as RuleFn<Role | null>[],
      // 對話框 / 表單 / 草稿
      dlg: false,
      valid: false,
      index: -1, // rows 中被編輯資料的索引
      ok: false, // snackbar

      // 簡單驗證規則
      nameRules: [
        (v: string) => !!v || "必填",
        (v: string) => (v && v.length >= 2) || "至少 2 字",
      ],
      emailRules: [
        (v: string) => !!v || "必填",
        (v: string) => /.+@.+\..+/.test(v) || "Email 格式不正確",
      ],
    };
  },
  methods: {
    /** 點「編輯」：複製一份草稿並打開對話框 */
    editUser(user: User) {
      this.index = this.rows.findIndex((r) => r.id === user.id);
      this.draft = { ...user }; // 做一份淺拷貝，避免未存檔就改動原資料
      this.dlg = true;
    },
    /** 取消：關閉對話框，不改資料 */
    cancel() {
      this.dlg = false;
      const form = this.$refs.form as Vue & { resetValidation: () => void };
      form && form.resetValidation();
    },
    save() {
      const form = this.$refs.form as Vue & {
        validate: () => boolean;
        resetValidation: () => void;
      };
      if (form && form.validate()) {
        // Vue 2 陣列指定索引賦值不會觸發更新；用 this.$set 確保響應式
        if (this.index < 0) return;
        this.$set(this.rows, this.index, { ...this.draft });
        this.dlg = false;
        this.ok = true;
        form.resetValidation();
      }
    },
  },
});
</script>
