import { ArrowRight } from 'lucide-react';
import { BoxLabel } from './Bento';

type NextPageProps = {
  index: number;
  href: string;
  title: string;
  note: string;
};

/** A full-width box that leads to the next page; a tint sweeps across it on
 *  hover and the arrow runs ahead. */
export default function NextPage({ index, href, title, note }: NextPageProps) {
  return (
    <a href={href} className="bx-box bx-next">
      <div className="bx-box-in">
        <BoxLabel index={index} label="Next" />
        <span className="bx-next-title">
          {title}
          <ArrowRight aria-hidden="true" />
        </span>
        <span className="bx-next-note">{note}</span>
      </div>
    </a>
  );
}
