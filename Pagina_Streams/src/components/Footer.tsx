import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Stream — Proyecto PW - Pronto todo acabara
    </footer>
  );
}