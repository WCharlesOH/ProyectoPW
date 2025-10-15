interface PlayerProps {
  imagenUrl: string;
}

export default function Player({ imagenUrl }: PlayerProps) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", position: "relative", maxWidth: 800 }}>
      <img
        src={imagenUrl}
        alt="Vista previa del stream"
        style={{ width: "100%", borderRadius: 10, objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          backgroundColor: "red",
          color: "white",
          padding: "5px 10px",
          borderRadius: 5,
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        EN VIVO
      </div>
    </div>
  );
}