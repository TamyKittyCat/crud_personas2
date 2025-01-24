-- Elimina la tabla si existe
DROP TABLE IF EXISTS public.personas;

-- Crea la tabla personas
CREATE TABLE IF NOT EXISTS public.personas
(
    "ID" SERIAL,
    nombre VARCHAR NOT NULL,
    "apellidoPaterno" VARCHAR NOT NULL,
    "apellidoMaterno" VARCHAR,
    "fechaNacimiento" DATE,
    "numeroContacto" VARCHAR,
    email VARCHAR,
    PRIMARY KEY ("ID")
);

-- Cambia el propietario de la tabla a 'postgres'
ALTER TABLE public.personas
    OWNER to postgres;
