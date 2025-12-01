import { useState } from "react";

interface TituloProps {
  texto: string;
}

export default function Titulo({ texto }: TituloProps) {
  const [tamanoFuente] = useState<number>(2);

  return (
    <h2
      style={{
        textAlign: "center",
        fontSize: `${tamanoFuente}em`,
        marginTop: "0px",
        color: "#fff",
        marginBottom: "20px",
        transition: "all 0.3s ease",
      }}
    >
      {texto}
    </h2>
  );
}
