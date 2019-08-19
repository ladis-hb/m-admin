<template>
  <b-col cols="12" class=" border-bottom m-2 p-1"
    ><b>{{ title }}</b></b-col
  >
</template>

<script>
export default {
  name: "separated",
  props: {
    title: {
      type: String,
      default: "title"
    }
  }
};
</script>

<style lang="scss" scoped></style>
