import { GraduationCap } from 'lucide-react';
import { capabilities, education } from '../../data/portfolio';
import { Box } from './Bento';

/** Every skill group with its tags, nothing hidden — two columns on desktop. */
export default function Skills() {
  return (
    <Box id="skills" index={9} label="Skills" className="bx-skills">
      <div className="bx-skill-groups">
        {capabilities.map((group, i) => (
          <div key={group.title} className="bx-skill">
            <p className="bx-sub">
              <span className="gx-index">{String(i + 1).padStart(2, '0')}</span>
              {group.title}
              <span className="gx-count">{group.tags.length}</span>
            </p>
            <div className="gx-tags">
              {group.tags.map((tag) => (
                <span key={tag} className="gx-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

/** Narrow box: the degree, with the CGPA as its one big number. */
export function Education() {
  return (
    <Box index={8} label="Education" className="bx-edu">
      <div className="bx-edu-body">
        <span className="gx-company-logo" aria-hidden="true">
          <GraduationCap />
        </span>
        <p className="bx-edu-school">{education.school}</p>
        <p className="bx-edu-degree">{education.degree.replace(/ \(BE\)$/, '')}</p>
        <p className="bx-edu-year gx-tabular">Class of {education.year}</p>
      </div>
      <div className="bx-edu-score">
        <span className="bx-edu-cgpa gx-tabular">{education.cgpa}</span>
        <span className="bx-edu-cgpa-label">CGPA</span>
      </div>
    </Box>
  );
}
