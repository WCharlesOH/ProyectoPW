-- CreateTable
CREATE TABLE "Usuario" (
    "ID" SERIAL NOT NULL,
    "NombreUsuario" TEXT NOT NULL,
    "Contraseña" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "HorasTransmision" INTEGER NOT NULL,
    "Monedas" INTEGER NOT NULL,
    "NivelStreams" INTEGER NOT NULL,
    "Puntos" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Suscripcion" (
    "ID_Streamer" INTEGER NOT NULL,
    "ID_Viewer" INTEGER NOT NULL,
    "NivelViewer" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("ID_Streamer","ID_Viewer")
);

-- CreateTable
CREATE TABLE "Regalo" (
    "ID_Regalo" SERIAL NOT NULL,
    "NombreRegalo" TEXT NOT NULL,
    "PrecioRegalo" INTEGER NOT NULL,
    "DescripcionRegalo" TEXT NOT NULL,
    "icono" TEXT NOT NULL,
    "ID_Streamer" INTEGER NOT NULL,

    CONSTRAINT "Regalo_pkey" PRIMARY KEY ("ID_Regalo")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "ID" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Juego" (
    "ID_Juego" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,
    "Descripcion" TEXT,
    "CategoriaID" INTEGER NOT NULL,

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("ID_Juego")
);

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_ID_Streamer_fkey" FOREIGN KEY ("ID_Streamer") REFERENCES "Usuario"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_ID_Viewer_fkey" FOREIGN KEY ("ID_Viewer") REFERENCES "Usuario"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regalo" ADD CONSTRAINT "Regalo_ID_Streamer_fkey" FOREIGN KEY ("ID_Streamer") REFERENCES "Usuario"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juego" ADD CONSTRAINT "Juego_CategoriaID_fkey" FOREIGN KEY ("CategoriaID") REFERENCES "Categoria"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
