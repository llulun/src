<template>
  <div id="app">
    <header class="top-bar">
      <h1>QQ空间自动化控制台</h1>
    </header>

    <div class="main-layout">
      <IframePanel />
      <div class="side-panel">
        <PluginManager />
        <LogPanel />
      </div>
    </div>
  </div>
</template>

<script setup>
import IframePanel from './components/IframePanel.vue'
import PluginManager from './components/PluginManager.vue'
import LogPanel from './components/LogPanel.vue'
</script>

<style scoped>
#app {
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.top-bar {
  background: #409EFF;
  color: white;
  padding: 10px;
}
.main-layout {
  display: flex;
  flex: 1;
}
.side-panel {
  width: 300px;
  border-left: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto;
}
</style>
