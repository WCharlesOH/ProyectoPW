export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0e0e10',
        color: '#aaa',
        textAlign: 'center',
        padding: '12px',
        marginTop: '32px'
      }}
    >
      © {new Date().getFullYear()} Stream — Proyecto PW
    </footer>
  )
}