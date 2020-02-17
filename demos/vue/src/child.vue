<template>
  <div>
    <van-icon name="success"></van-icon>
    <h2>child component</h2>
  </div>
</template>

<script>
import { Icon } from "vant";

export default {
  components: {
    "van-icon": Icon
  },

  data() {
    return {
      msg: "vue 2.0"
    };
  },

  methods: {
    showMsg() {
      console.log("show message");
    }
  }
};
</script>

<style>
h1 {
  color: red;
}
</style>