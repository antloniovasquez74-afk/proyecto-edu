export default function Figura({ tipo, chica }) {
  const p = { fill: '#ffb703', stroke: '#023047', strokeWidth: 6 };
  return (
    <svg viewBox="0 0 120 120" className={'figura' + (chica ? ' chica' : '')} role="img" aria-label={chica ? tipo : 'figura geométrica'}>
      {tipo === 'Círculo' && <circle cx="60" cy="60" r="48" {...p} />}
      {tipo === 'Cuadrado' && <rect x="14" y="14" width="92" height="92" {...p} />}
      {tipo === 'Triángulo' && <polygon points="60,10 112,108 8,108" {...p} />}
      {tipo === 'Rectángulo' && <rect x="6" y="32" width="108" height="56" {...p} />}
    </svg>
  );
}
