<template>
  <div>
    <h1>hello world ~ {{ msg }}</h1>
    <button @click="showMsg">click me!</button>
    <van-button name="success" type="primary">默认按钮</van-button>
    <child></child>
  </div>
</template>

<script>
import child from "./child";
import { Button } from "vant";

export default {
  components: {
    child,
    "van-button": Button
  },

  data() {
    return {
      msg: "vue 2.1"
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