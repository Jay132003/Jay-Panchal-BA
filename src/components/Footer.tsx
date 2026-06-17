export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div>
        <p>Navigate</p>
        <a href="#home">Home</a>
        <a href="#work">Work</a>
        <a href="#skills">Skills</a>
        <a href="/assets/jay-panchal-resume.pdf" target="_blank" rel="noreferrer">
          Resume
        </a>
      </div>
      <div>
        <p>Connect</p>
        <a href="mailto:panchalj481@gmail.com">Email</a>
        <a href="https://linkedin.com/in/PanchalJay" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="tel:+919624287628">Phone</a>
      </div>
      <small>© {year} Jay Panchal. All rights reserved.</small>
    </footer>
  );
}
