import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/xml-hint';
import 'codemirror/mode/python/python';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/textile/textile';
import 'codemirror/mode/shell/shell';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/addon/hint/show-hint.css';

export default (id, o) => {
  CodeMirror.fromTextArea(document.getElementById(id), {
    lineNumbers: true,
    theme: 'mdn-like',
    readOnly: true,
    ...o,
  });
};
