import { education } from '../data/portfolio';

export default function Education() {
  return (
    <section className="content-section education">
      <h2>Education</h2>
      <div className="education-row">
        <div>
          <h3>{education.school}</h3>
          <p>{education.degree}</p>
        </div>
        <div className="education-meta">
          {education.year}
          <small>CGPA: {education.cgpa}</small>
        </div>
      </div>
    </section>
  );
}
