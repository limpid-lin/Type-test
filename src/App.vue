<template>
  <router-view :key="routeKey"/>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { initStores } from './stores'

const route = useRoute()
const routeKey = computed(() => route.fullPath)

initStores()
</script>
