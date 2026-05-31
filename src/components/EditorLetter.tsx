export function EditorLetter({ letter }: { letter: string }) {
  const paras = letter.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="editor-letter reveal">
      <div className="el-label">Editor&apos;s Letter</div>
      <div className="el-body">
        {paras.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="el-sign">— The Editor</div>
    </div>
  );
}
