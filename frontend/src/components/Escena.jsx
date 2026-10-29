// Dibuja la escena de una pregunta de conocimiento espacial (SVG + emojis).
const T = ({ x, y, s = 52, children }) => (
  <text x={x} y={y} fontSize={s} textAnchor="middle" dominantBaseline="central">{children}</text>
);
const trazo = { stroke: '#023047', strokeWidth: 5 };

export default function Escena({ e }) {
  return (
    <svg viewBox="0 0 300 200" className="escena" role="img" aria-label="escena para ubicar el objeto">
      <rect x="0" y="0" width="300" height="200" rx="18" fill="#e8f7fb" />
      <line x1="10" y1="192" x2="290" y2="192" stroke="#8ecae6" strokeWidth="6" strokeLinecap="round" />
      {(e.tipo === 'adentro' || e.tipo === 'afuera') && <>
        <rect x="80" y="70" width="140" height="105" rx="10" fill="#fde8b0" {...trazo} />
        <T x={e.tipo === 'adentro' ? 150 : 262} y={e.tipo === 'adentro' ? 125 : 150} s={54}>{e.objeto}</T>
      </>}
      {e.tipo === 'arriba' && <><T x={150} y={150} s={84}>{e.ref}</T><T x={150} y={38}>{e.objeto}</T></>}
      {e.tipo === 'abajo' && <><T x={150} y={45} s={80}>{e.ref}</T><T x={150} y={152}>{e.objeto}</T></>}
      {(e.tipo === 'encima' || e.tipo === 'debajo') && <>
        <rect x="65" y="118" width="170" height="14" rx="4" fill="#9c6644" {...trazo} />
        <rect x="80" y="132" width="12" height="58" fill="#9c6644" {...trazo} />
        <rect x="208" y="132" width="12" height="58" fill="#9c6644" {...trazo} />
        {e.tipo === 'encima' ? <T x={150} y={92} s={48}>{e.objeto}</T> : <T x={150} y={160} s={44}>{e.objeto}</T>}
      </>}
      {e.tipo === 'cerca' && <><T x={122} y={110} s={58}>{e.par[0]}</T><T x={180} y={110} s={58}>{e.par[1]}</T></>}
      {e.tipo === 'lejos' && <><T x={40} y={110} s={58}>{e.par[0]}</T><T x={260} y={110} s={58}>{e.par[1]}</T></>}
    </svg>
  );
}
