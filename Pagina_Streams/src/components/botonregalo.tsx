import { useEffect, useRef, useState } from "react";

	interface BotonRegaloProps {
	  monedas?: number;
	  setMonedas?: (nuevas: number) => void;
	  regalos?: Regalo[]; // lista opcional proporcionada por la página
	}
	
	type Regalo = {
	  id: number | string;
	  nombre: string;
	  costo: number;
	  puntos?: number;
	  icono?: string;
	};

export default function BotonRegalo({ monedas = 0, setMonedas, regalos: propsRegalos }: BotonRegaloProps) {
	const [abierto, setAbierto] = useState(false);
	const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
	const botonRef = useRef<HTMLButtonElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const [notificacion, setNotificacion] = useState<string | null>(null);
	const [toastCoords, setToastCoords] = useState<{ top: number; left: number } | null>(null);

	const defaultRegalos: Regalo[] = [
		{ id: "r1", nombre: "Corazón", costo: 10, icono: "❤️" },
		{ id: "r3", nombre: "Télevisor", costo: 50, icono: "📺" },
		{ id: "r4", nombre: "Rayo", costo: 100, icono: "⚡" },
	];

		const regalosList: Regalo[] = propsRegalos ?? defaultRegalos;

	// Colocar menú en posición fija cerca del botón para que se superponga
	const posicionarMenu = () => {
		const btn = botonRef.current;
		if (!btn) return setCoords(null);
		const r = btn.getBoundingClientRect();
		// Mostrar el menú justo arriba del botón, centrado
		setCoords({ top: r.top - 8, left: r.left + r.width / 2 });
	};

	useEffect(() => {
		if (abierto) {
			posicionarMenu();
		} else {
			setCoords(null);
		}
	}, [abierto]);

	// Cerrar al hacer clic fuera
	useEffect(() => {
		const onDown = (e: MouseEvent) => {
			const target = e.target as Node | null;
			if (!target) return;
			if (
				botonRef.current &&
				(botonRef.current.contains(target as Node) || menuRef.current?.contains(target as Node))
			) {
				return;
			}
			setAbierto(false);
		};
		window.addEventListener("mousedown", onDown);
		window.addEventListener("scroll", posicionarMenu, true);
		window.addEventListener("resize", posicionarMenu);
		return () => {
			window.removeEventListener("mousedown", onDown);
			window.removeEventListener("scroll", posicionarMenu, true);
			window.removeEventListener("resize", posicionarMenu);
		};
	}, []);

		const comprarRegalo = (regalo: Regalo) => {
			if (monedas < regalo.costo) {
				// Mostrar notificación no bloqueante en lugar de alert
				setNotificacion("No tienes suficientes monedas para ese regalo.");
				const rect = botonRef.current?.getBoundingClientRect();
				if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
				setTimeout(() => setNotificacion(null), 2200);
				return;
			}
			if (setMonedas) setMonedas(monedas - regalo.costo);
			// Notificación de éxito (no emergente)
			setNotificacion(`Has enviado ${regalo.icono ?? ""} ${regalo.nombre} por ${regalo.costo} monedas.`);
			const rect = botonRef.current?.getBoundingClientRect();
			if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
			setTimeout(() => setNotificacion(null), 2200);
			setAbierto(false);
		};

	return (
		<div className="boton-regalo" style={{ position: "relative", display: "inline-block" }}>
			<button
				ref={botonRef}
				onClick={() => setAbierto((v) => !v)}
				aria-expanded={abierto}
				style={{
					backgroundColor: "#1f1f23",
					color: "white",
					border: "1px solid #333",
					borderRadius: "6px",
					padding: "6px 10px",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					gap: "8px",
					fontWeight: "600",
				}}
			>
				🎁 Regalos
			</button>

			{abierto && coords && (
				// menú en posición fija para poder superponerse sobre otros elementos
				<div
					ref={menuRef}
					role="dialog"
					aria-label="Menú de regalos"
					style={{
						position: "fixed",
						top: coords.top - 220, // mostrar arriba del botón
						left: Math.max(8, coords.left - 160),
						width: 320,
						backgroundColor: "#1b1b1f",
						border: "1px solid #333",
						borderRadius: 10,
						boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
						color: "white",
						zIndex: 9999,
						padding: 12,
					}}

				>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
						<strong style={{ fontSize: "1rem" }}>Enviar regalo</strong>
						<button
							onClick={() => setAbierto(false)}
							style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer" }}
							aria-label="Cerrar menú de regalos"
						>
							✖
						</button>
					</div>

					<div style={{ maxHeight: 260, overflowY: "auto" }}>
									{regalosList.map((r: Regalo) => (
							<div
								key={r.id}
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "8px",
									borderRadius: 8,
									marginBottom: 8,
									background: "linear-gradient(180deg,#141416,#1e1e22)",
								}}
							>
								<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
									<div style={{ fontSize: 20 }}>{r.icono}</div>
									<div>
										<div style={{ fontWeight: 700 }}>{r.nombre}</div>
										<div style={{ fontSize: 12, color: "#b3b3b3" }}>Envía un gesto al streamer</div>
									</div>
								</div>

												<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
													<div style={{ fontWeight: 800 }}>{r.costo} <span style={{ fontSize: 12 }}>
														monedas
													</span></div>
													<button
														onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); comprarRegalo(r); }}
										style={{
											backgroundColor: "#00b7ff",
											border: "none",
											color: "black",
											padding: "6px 10px",
											borderRadius: 6,
											cursor: "pointer",
											fontWeight: 700,
										}}
									>
										Enviar
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Toast de notificación no bloqueante */}
			{notificacion && (
				<div
					role="status"
					style={{
						position: "fixed",
						top: toastCoords?.top ?? window.innerHeight * 0.1,
						left: toastCoords?.left ?? window.innerWidth / 2 - 160,
						width: 240,
						background: "rgba(0,0,0,0.85)",
						color: "white",
						padding: "10px 14px",
						borderRadius: 8,
						boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
						zIndex: 10001,
						textAlign: "center",
					}}
				>
					{notificacion}
				</div>
			)}
		</div>
	);
}