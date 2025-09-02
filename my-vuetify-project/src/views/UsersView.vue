<template>
  <v-container>
    <div class="text-h3">使用者列表</div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { users as seed, roles } from "@/domain/users";
import { User } from "@/types/user"; // 匯入型別

export default Vue.extend({
  name: "UsersView",
  data() {
    return {
      rows: [...seed] as User[],
      roles,
    };
  },
});
</script>
