<template>
  <div class="fireworks-wrapper">
    <div class="fireworks" style="left: 15%; top: 5%;"></div>
    <div class="fireworks" style="right: 30%; top: 13%; animation-delay: -0.4s;"></div>
    <div class="fireworks" style="left: 5%; top: 23%; animation-delay: -1.7s;"></div>
    <div class="fireworks" style="right: 45%; top: 8%; animation-delay: -3.1s;"></div>
  </div>
</template>

<style lang="scss" scoped>
.fireworks-wrapper{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}
.fireworks {
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
/*     padding-bottom: 100px; */
    background: url('/imgs/typing/e9951400.png') right top no-repeat;
    background-size: auto 1.5rem;
    animation: fireworks 2s steps(24) infinite, random 8s steps(1) infinite;
}
@keyframes fireworks {
    0% {
        background-position: 0%;
    }
    50%,
    100% {
        background-position: 100% 100%;
    }
}

@keyframes random {
    0% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(200%, 50%) scale(0.8);
    }
    50% {
        transform: translate(80%, 80%) scale(1.2);
    }
    75% {
        transform: translate(20%, 60%) scale(0.65);
    }
}
@media screen and (prefers-reduced-motion) {
    /* 禁用不必要的动画 */
    .fireworks {
        animation: none;
    }
}
</style>

<script>
export default {
  name: 'CompletePage',
  setup() {},
}
</script>
