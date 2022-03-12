<template>
  <div id="editorBlock">
    <div  id="aceEditor" class="editor"></div>
    <button class="sendSolution" @click="sendSolution">Отправить решение</button>
  </div>
</template>

<script>
  import 'ace-builds'
  import 'ace-builds/webpack-resolver'
  import ApiRequest from "../../utils/requests";

  export default {
    data() {
      return {
        api: null,
      }
    },
    mounted() {
      this.api = new ApiRequest('http://code.liokor.com/api/v1');

      this.aceEditor = ace.edit('aceEditor');
      this.aceEditor.setOptions({
        fontSize: '12pt',
      });

      //this.aceEditor.setTheme('ace/theme/dawn');
      this.aceEditor.session.setMode('ace/mode/c_cpp');

      this.aceEditor.setValue(localStorage.getItem('code') || "");
    },
    methods: {
      async sendSolution() {
        const code = this.aceEditor.getValue();
        localStorage.setItem('code', code);
        /*const response = await this.api.post('/tasks/1/solutions', {
          sourceCode: code
        });*/
        const response = await fetch(`/tasks/1/solutions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({sourceCode: code}),
        });
        if (!response.ok) {
          alert("Не удалось отправить решение");
        }

        const res = await response.json();
        alert('Решеие отправлено. Результат: \n' + JSON.stringify(res));

        //location.reload();
      },
    }
  }
</script>
