import { quote } from '../data/portfolio';

export default function Quote() {
  return (
    <blockquote>
      “{quote.text}”
      <cite>— {quote.author}</cite>
    </blockquote>
  );
}
