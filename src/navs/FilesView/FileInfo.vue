<template lang="pug">
  div.file-info(:class="{'selected':  $amada.editor_view==editor_view}", @click="select")
    img(src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAVDSURBVGhD7ZdtTNZlFMbN+pBu1arVtCydgkGoaOLwBUcZvg2drxgZggoimGvWtLRGmGNDsxY4dTjDlw+3JRNEQx4QEBRwbWlrsJnVsi1p5fqiXyrbvE739XggHnmefLn/PH3ht539/9fh3Oe6Lx37j3599NGHNwzOloHPvI7pT6+VFK9qyBrMGp4tj6hF7zN0jQwalotLw9aIeF1Dc/Hbs7mYrFa9S0QOCmwhYjUyI3Mlyauy+9ojckRsXR0RjjBRq2CisuWqSs+we5ufW4Vf7bOD++1774aJyYKJyfI+yKgsNNvdbWOyMNI+O+gR05thYlfCxK70PsjYTDTbauM7w9j3DvqM7a0wcStg4pZ7HyRuOZrtbn8QMmEZRo5fgQ562Z95HyY+HWZiuvdB4jOkaWIGLqj0wzDxGeig3ySvwyTYIFOWeR8kYRmKbN2w+z+Zko53Osvq0oR0EXpOTscIHXcnMQ0mMc37IDMW4zG7uzbxNdx4MU0keOFDHXfn5VdhkpZ6H6STiYsxIHmpPHprWd9r9NYxd2alwsxK7b0goaAnvVW6k7wEZs4r4Q9CT3qrdGf+Yph5KW5BclrxZEajPKjyjqAnvVW6s2gRzKKFbkHeapUDb7bi95QyuV9bt4We9FbpTuoCmNQFtw+yoQUP6WsA+SL9NzXjysYWHNdWyNnu0JPeKt1Jmw+TNu+/g7z9JYasb8EPtt7TVhf5zZLwwRmRLaeRRc0ZzvKMfyAE9KS3Sncy5sJkzA0d5N3TGJzXjO9s/Znfghna7qKwCYWFjcC2FjxFzRnO8gzP+oeCQE96q3QnKxkmc07wINvtL7G95IWtjbi+tQmztR1AUQPaik7hvEo/nOUZnuUObQdAT3qrdGe1XZaT3DNI8Rk8saMB7TtO4XpxPeZqO4DddTK8pEGkpAF52uqCZ3iWO7hL213Qk94q3Vk7C2bt7MAgB+vw+N46fPNpHf7eexILtd2D/XV4Y3+dyL56vKCtAHjWv8Pu4k5t+6EnvVW6s24mzLqZgUFMDeoP1Yoc8mGJtoJyqAa1n9XgFxG5T1s94A7u4k5t+aEnvVW6s2E6zPrpgUEqfdhd6ROxz12hLlldjYfLffirohol2uoBz3KH7tqtbT/0pLdKdzZOg9k0LTBImf2w1VZh38kTIidPYE+wMD6fpFRXi/h8SNZWADzDs9zBXdypP/JDT3qrdCfPLst7qecvOy/Schx7Wo6L2GfprRdpqJID9VX44+xhDNBWF5zlGT0b9B+CnvRW6c7mRJjNiT2DEF7gfCV2fV0pcv4oDnaGkXzpby94pfXYv1/zTjjDWf8ZezZYCEJPeqt0p2AqTMHU4EEIL3KxAsUXK0QulqOIvXMVknDOXvSroze/5t3hjH/WngkVgtCT3ird2ZYAs21K6CCd/HwY7/90RKL43n4Uhe0VwLeVN7/m3eEMZ1WGhJ70VunOR5NhPr6DIN35/gjabAV8ze8WetJbpTvFk2CKJt15EGmUBy6XYfvlMsnW1j1BT3qrdGdnPMzO+Lv7H/ECetJbpTslcTB7JoQ/CD3prdKdUrusNC78QehJb5XuHBgHc3Bc+IPQk94q3TGxMCY2/EHoSW+V7nw+BubwGFxTGTboSW+V7pSPgikfLWKfBUdGS3Y4il7q6V2QYzEwx2JE/p/yMEhVNIyta19EI7IqSsaHo/xe1pPeeg13aqNQUBMF1EYj0xctSeEoetGz5jls0Wu40/i8DGqIxKWGkSLhLfxIb72GN5wbLAMbIyWpKUJSwlH0Ojuk5x9kffTRx73Qr98/g3+nyYIJJKoAAAAASUVORK5CYII=")
    | {{editor_view.name}}
</template>
<style lang="scss" scoped>
.file-info {
  border-left: 1px dashed $border;
  border-right: 1px dashed $border;
  border-bottom: 1px dashed $border;
  margin-bottom: 2px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  color: $grey-dark;
  line-height: 25px;

  &.selected {
    background-color: rgba($red, 0.1);
  }

  &:first-child {
    border-top: 1px dashed $border;
  }

  &:hover {
    background-color: rgba($primary, 0.13);
    // color: white;
  }

  img {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
}
</style>
<script>
export default {
  props: ["editor_view"],
  methods: {
    select() {
      this.$amada.editor_view_set(this.editor_view);
    }
  }
};
</script>
