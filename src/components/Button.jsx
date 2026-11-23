import { Link } from 'react-router-dom';

/** variant: 'gold' | 'velvet' | 'ghost' | 'paper' | 'text' */
export default function Button({ variant = 'gold', to, href, className = '', children, icon: Icon, size, ...rest }) {
  const cls = `btn btn--${variant} ${size ? `btn--${size}` : ''} ${className}`;
  const inner = (
    <>
      {Icon && <Icon size={18} strokeWidth={1.6} aria-hidden="true" />}
      <span>{children}</span>
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>{inner}</a>;
  return <button type="button" className={cls} {...rest}>{inner}</button>;
}
