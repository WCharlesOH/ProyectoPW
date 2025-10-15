import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";

interface PerfilProps {
  monedas: number;
  setMonedas: (monedas: number) => void;
}

export default function Perfil({ monedas, setMonedas }: PerfilProps) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div style={{ flex: 1, padding: "20px"}}>
        <h2>Perfil del Viewer</h2>
      </div>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "right" }}>
        <ChatBox monedas={monedas} setMonedas={setMonedas} />
      </div>
    </div>
  );
}