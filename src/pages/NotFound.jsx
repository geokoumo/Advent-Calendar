import Button from '../components/Button.jsx';
import { Ornament } from '../components/decor/Decor.jsx';

export default function NotFound() {
  return (
    <div className="page not-found">
      <Ornament size={46} />
      <h1 className="not-found__title">This door doesn’t exist</h1>
      <p className="not-found__text">But there are twenty-five that do.</p>
      <Button variant="gold" to="/calendar">Go to the calendar</Button>
    </div>
  );
}
