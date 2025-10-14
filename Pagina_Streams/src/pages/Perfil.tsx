import ChatBox from "../components/ChatBox";
import Sidebar from "../components/Sidebar";


export default function Perfil() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>

      <div style={{ flex: 1, padding: "20px"}}>
      <h2>Perfil del Streamer</h2>
      </div>
      <div style={{ marginTop: "20px" , display: "flex", justifyContent: "right" }}>
        <ChatBox />
      </div>
    </div>
  );
}