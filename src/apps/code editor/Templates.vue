<style lang="stylus">
  @import "../../styles/constants.styl"

  background = linear-gradient(30deg, #0e2028 0%, #2e3f44 40%, #0c2129 100%) repeat scroll 0% 0%;

  .template-select
    padding-top 10px
    padding-left 10px
    select
      background background
      color textColor1
      border 1px solid #BABABA
      border-radius 5px
      font-size 1rem
      option
        background #2e3f44
</style>

<template>
  <div class="template-select">
    <select v-model="templateSelected">
      <option value="">шаблоны</option>
      <option v-for="templateName in Object.keys(templates)">{{ templateName }}</option>
    </select>
  </div>
</template>

<script>
  import SolutionTemplates from "../../utils/solution-templates";

  export default {
    data() {
      return {
        templates: SolutionTemplates,
        templateSelected: '',
        templateSelectedWatchDisabled: false,
      }
    },

    watch: {
      templateSelected(newName) {
        if (!newName) {
          return
        }

        if (this.templateSelectedWatchDisabled) {
          return
        }
        this.templateSelectedWatchDisabled = true

        this.changeTemplate(newName)
      }
    },

    methods: {
      changeTemplate: async function (templateName) {
        if (await this.$store.state.modal.confirm(`Текущее решение будет потеряно и откроется шаблон ${templateName}. Продолжить?`)) {
          const templateItems = this.templates[templateName]
          this.$emit('openTemplate', templateItems)
        }

        this.templateSelected = ''
        await this.$nextTick()
        this.templateSelectedWatchDisabled = false
      },
    }
  }
</script>
