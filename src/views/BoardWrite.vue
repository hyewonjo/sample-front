<template>
  <div class="board">
    <h1>This is board write page</h1>
    <table>
      <colgroup>
        <col style="width:18.5%">
        <col style="width:auto">
      </colgroup>
      <tr>
        <th scope="row">작성자</th>
        <td><input type="text" placeholder="아이디를 입력하세요." ref="writerInput" v-model.trim="writer"></td>
      </tr>
      <tr>
        <th scope="row">제목</th>
        <td><input type="text" placeholder="제목을 입력하세요." ref="subjectInput" v-model.trim="subject"></td>
      </tr>
      <tr>
        <th scope="row">내용</th>
        <td><textarea rows="10" placeholder="내용을 입력하세요." ref="contentTextarea" v-model.trim="content"></textarea></td>
      </tr>
    </table>
    <div class="buttons">
      <div class="right">
        <button class="button blue" v-on:click="boardSaveClick()">등록</button>
        <button class="button" v-on:click="boardCancelClick()">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoardWrite',
  data: function() {
    return {
      writer: '',
      subject: '',
      content: '',
    };
  },
  methods: {
    async boardSaveClick() {
      if (this.writer === '') {
        alert('작성자를 입력하세요');
        this.$refs.writerInput.focus();
        return;
      } else if (this.subject === '') {
        alert('제목을 입력하세요');
        this.$refs.subjectInput.focus();
        return;
      } else if (this.content === '') {
        alert('내용을 입력하세요');
        this.$refs.contentTextarea.focus();
        return;
      }

      if (!confirm('등록하시겠습니까?')) return;

      let boardItem = {
        writer: this.writer,
        subject: this.subject,
        content: this.content,
      };

      try{
        const res = await this.axios.post('http://localhost:9000/boards', boardItem);
        if (res.data.success) {
          alert('등록되었습니다.');
          this.$router.push({name: 'BoardList'});
        } else {
          alert('등록되지 않았습니다.');
        }
      } catch(err) {
        console.error(err);
        alert('등록되지 않았습니다.');
      }
    },
    boardCancelClick() {
      this.$router.push({name: 'BoardList'});
    }
  },
  mounted() {
    this.$refs.writerInput.focus();
  }
};
</script>

<style scoped>
.board { width:800px; margin: 20px auto; }
.board table { width:100%; border-top:2px solid #1d4281; border-spacing:0; }
.board table th { padding:8px 10px 10px 10px; vertical-align:middle; color:#1d4281; font-size:14px; border-bottom:1px solid #ccc; background:#f8f8f8; }
.board table td { padding:7px 20px 9px 20px; text-align:left; vertical-align:middle; border-bottom:1px solid #ccc; font-size:14px; line-heighT:150%; }
.board table td input, .board table td textarea { width:100%; color:#000 !important; }
.buttons { position:relative; height:32px; margin-top:20px; }
.buttons > div.right { position:absolute; height:32px; right:0; }
.buttons > div > .button { overflow:visible; cursor:pointer; min-width:125px; height:32px; margin:0 2px; padding:0 15px; line-height:32px; font-size:14px; border:1px solid #dfdfdf; background:#fff; border-radius:10px; }
.buttons > div > .button.blue { color:#fff; border-color:#0099d2 !important; background:#0099d2 !important; }
</style>