function formatSQL() {
  // ace-editorのテキストレイヤーを取得
  const editor = ace.edit('brace-editor');

  // SQLクエリを取得
  const sqlQuery = editor.getSession().getValue();
  
  // SQL整形APIにリクエスト
  const response = fetch('https://us-central1-sqlfluff-on-chrome.cloudfunctions.net/sqlfluff-on-redash-endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql: sqlQuery
    }),
  })

  // 整形されたSQLを取得
  response.then(res => res.json()).then(data => {
    // 整形されたSQLをalertで表示
    alert(data.formattedSQL);
  });

  // 整形されたSQLでエディターの内容を上書き
  const newSqlCode = response.formattedSQL;

  // エディターのドキュメントオブジェクトに新しい内容を設定
  editor.getSession().doc.setValue(newSqlCode);
}
  
// MutationObserver を使ってエディターのツールバーが表示されたらボタンを挿入
const observer = new MutationObserver((mutations, obs) => {
  const editorToolbar = document.querySelector('#app-content > div > main > div > div > div > div.row.editor.resizable > query-editor > section > div > div.editor__control > div');
  if (editorToolbar) {
    const span_emoji = document.createElement('span')
    const span_text = document.createElement('span')
    
    // ボタンのテキストを指定
    span_text.textContent = 'Format';
    
    // spanのクラスを指定
    span_text.className = 'hidden-xs m-l-5';
    span_emoji.className = 'fa fa-code';
    
    // ボタン要素を作成
    const button = document.createElement('button');

    // buttonのクラスを指定
    button.className = 'btn btn-default m-l-5';
    
    // ボタンにテキストを挿入
    button.appendChild(span_emoji);
    button.appendChild(span_text);

    // ボタンクリック時に fetchSqlFromEditor を実行
    button.addEventListener('click', function() {
      formatSQL();
    });

    // Saveボタンの前に挿入
    const saveButton = editorToolbar.querySelector('#app-content > div > main > div > div > div > div.row.editor.resizable > query-editor > section > div > div.editor__control > div > button:nth-child(5)');
    editorToolbar.insertBefore(button, saveButton);

    // 監視を停止
    obs.disconnect();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

