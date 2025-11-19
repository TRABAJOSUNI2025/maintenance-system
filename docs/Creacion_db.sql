-- =======================================
-- 1. TABLA USUARIO (login y permisos base)
-- =======================================
CREATE TABLE Usuario (
    idUsuario        SERIAL PRIMARY KEY,
    username         VARCHAR(40) UNIQUE NOT NULL,
    passwordHash     VARCHAR(200) NOT NULL,
    correo           VARCHAR(60) UNIQUE NOT NULL,
    estado           CHAR(1) DEFAULT 'A'
);

-- =======================================
-- 2. TABLA EMPLEADO
-- =======================================
CREATE TABLE Empleado (
    idEmpleado       SERIAL PRIMARY KEY,
    idUsuario        INT NOT NULL UNIQUE,
    dni              CHAR(8) UNIQUE NOT NULL,
    nombres          VARCHAR(40) NOT NULL,
    apePaterno       VARCHAR(30),
    apeMaterno       VARCHAR(30),
    telefono         VARCHAR(9),
    especialidad     VARCHAR(40),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- =======================================
-- 3. TABLA ROL (Operario, Supervisor, Admin)
-- =======================================
CREATE TABLE Rol (
    idRol            SERIAL PRIMARY KEY,
    nombreRol        VARCHAR(30) NOT NULL UNIQUE
);

-- =======================================
-- 4. TABLA PUENTE EmpleadoRol (N:M)
-- =======================================
CREATE TABLE EmpleadoRol (
    idEmpleado INT NOT NULL,
    idRol      INT NOT NULL,
    PRIMARY KEY (idEmpleado, idRol),
    FOREIGN KEY (idEmpleado) REFERENCES Empleado(idEmpleado),
    FOREIGN KEY (idRol) REFERENCES Rol(idRol)
);

-- =======================================
-- 5. CLIENTE
-- =======================================
CREATE TABLE Cliente (
    dniCliente    CHAR(8) PRIMARY KEY,
    nombre        VARCHAR(20),
    apePaterno    VARCHAR(20),
    apeMaterno    VARCHAR(20),
    telefono      VARCHAR(9),
    correo        VARCHAR(40)
);

-- =======================================
-- 6. VEHICULO
-- =======================================
CREATE TABLE Vehiculo (
    codVehiculo      CHAR(8) PRIMARY KEY,
    placa            VARCHAR(6) UNIQUE,
    marca            VARCHAR(20),
    modelo           VARCHAR(20),
    fechaFabricacion DATE,
    kilometraje      DECIMAL(10,2)
);

-- =======================================
-- 7. CUENTA CLIENTE
-- =======================================
CREATE TABLE CuentaCliente (
    codCuentaCliente     CHAR(8) PRIMARY KEY,
    dniCliente           CHAR(8) NOT NULL,
    codVehiculo          CHAR(8) NOT NULL,
    totalPendientes      INT DEFAULT 0,
    totalCancelados      INT DEFAULT 0,
    totalRealizados      INT DEFAULT 0,
    FOREIGN KEY (dniCliente) REFERENCES Cliente(dniCliente),
    FOREIGN KEY (codVehiculo) REFERENCES Vehiculo(codVehiculo)
);

-- =======================================
-- 8. LOTE TICKET
-- =======================================
CREATE TABLE LoteTicket (
    codLoteTicket        CHAR(8) PRIMARY KEY,
    totalGenerados       INT,
    totalAsignados       INT,
    totalDisponibles     INT,
    totalCancelados      INT,
    fechaGeneracion      DATE,
    fechaVencimiento     DATE
);

-- =======================================
-- 9. TICKET
-- =======================================
CREATE TABLE Ticket (
    codTicket        CHAR(8) PRIMARY KEY,
    codLoteTicket    CHAR(8),
    idSupervisor     INT,
    fecha            DATE,
    horaIniEstimada  TIME,
    horaFinEstimada  TIME,
    estado           INT,
    FOREIGN KEY (codLoteTicket) REFERENCES LoteTicket(codLoteTicket),
    FOREIGN KEY (idSupervisor) REFERENCES Empleado(idEmpleado)
);

-- =======================================
-- 10. MOVIMIENTOVENTA
-- =======================================
CREATE TABLE MovimientoVenta (
    canal              INT,
    corr               INT,
    codCuentaCliente   CHAR(8),
    codTicket          CHAR(8),
    monto              DECIMAL(10,2),
    fecha              DATE,
    hora               TIME,
    estado             INT,
    PRIMARY KEY (canal, corr),
    FOREIGN KEY (codCuentaCliente) REFERENCES CuentaCliente(codCuentaCliente),
    FOREIGN KEY (codTicket) REFERENCES Ticket(codTicket)
);

-- =======================================
-- 11. PROTOCOLO
-- =======================================
CREATE TABLE Protocolo (
    codProtocolo     INT PRIMARY KEY,
    nombre           VARCHAR(30),
    descripcion      VARCHAR(100),
    duracionEstimada INT
);

-- =======================================
-- 12. CATALOGO SERVICIOS
-- =======================================
CREATE TABLE CatalogoServicios (
    codServicio        CHAR(8) PRIMARY KEY,
    descripcion        VARCHAR(75),
    marca              VARCHAR(20),
    modelo             VARCHAR(30),
    tipoMantenimiento  VARCHAR(30),
    kilometrajeInicial INT,
    kilometrajeFinal   INT,
    tarifa             DECIMAL(10,2),
    duracion           INT,
    codProtocolo       INT,
    FOREIGN KEY (codProtocolo) REFERENCES Protocolo(codProtocolo)
);

-- =======================================
-- 13. MANTENIMIENTOS
-- =======================================
CREATE TABLE Mantenimientos (
    codMantenimiento  CHAR(8) PRIMARY KEY,
    codTicket         CHAR(8),
    codServicio       CHAR(8),
    horaInicioReal    TIME,
    horaFinReal       TIME,
    fechaRealiza      DATE,
    monto             DECIMAL(10,2),
    observaciones     VARCHAR(100),
    estado            INT,
    FOREIGN KEY (codTicket) REFERENCES Ticket(codTicket),
    FOREIGN KEY (codServicio) REFERENCES CatalogoServicios(codServicio)
);

-- =======================================
-- 14. REPUESTO
-- =======================================
CREATE TABLE CategoriaRepuesto (
    codCategoriaRepuesto CHAR(8) PRIMARY KEY,
    nombre               VARCHAR(20),
    descripcion          VARCHAR(80)
);

CREATE TABLE Repuesto (
    codRepuesto          CHAR(8) PRIMARY KEY,
    codCategoriaRepuesto CHAR(8),
    nombre               VARCHAR(20),
    descripcion          VARCHAR(100),
    fechaAdquisicion     DATE,
    fechaCaducidad       DATE,
    stock                INT,
    FOREIGN KEY (codCategoriaRepuesto) REFERENCES CategoriaRepuesto(codCategoriaRepuesto)
);

-- =======================================
-- 15. REPUESTO USADO
-- =======================================
CREATE TABLE RepuestoUsado (
    codRepuestoUsado CHAR(8) PRIMARY KEY,
    codRepuesto      CHAR(8),
    codMantenimiento CHAR(8),
    cantidadUsada    INT,
    FOREIGN KEY (codRepuesto) REFERENCES Repuesto(codRepuesto),
    FOREIGN KEY (codMantenimiento) REFERENCES Mantenimientos(codMantenimiento)
);

-- =======================================
-- 16. RAMPA / DISPONIBILIDAD
-- =======================================
CREATE TABLE Rampa (
    codRampa    CHAR(8) PRIMARY KEY,
    descripcion VARCHAR(100),
    capacidad   INT
);

CREATE TABLE HorarioDisp (
    codHorarioDisp CHAR(8) PRIMARY KEY,
    fecha          DATE,
    horaInicio     TIME,
    horaFin        TIME
);

CREATE TABLE DispRampa (
    codDispRampa   CHAR(8) PRIMARY KEY,
    codRampa       CHAR(8),
    codHorarioDisp CHAR(8),
    FOREIGN KEY (codRampa) REFERENCES Rampa(codRampa),
    FOREIGN KEY (codHorarioDisp) REFERENCES HorarioDisp(codHorarioDisp)
);

-- =======================================
-- 17. DISP OPERARIO
-- =======================================
CREATE TABLE DispOperario (
    codDispOperario CHAR(8) PRIMARY KEY,
    idEmpleado      INT,
    codHorarioDisp  CHAR(8),
    FOREIGN KEY (idEmpleado) REFERENCES Empleado(idEmpleado),
    FOREIGN KEY (codHorarioDisp) REFERENCES HorarioDisp(codHorarioDisp)
);

-- =======================================
-- 18. ASIGNAR OPERARIO
-- =======================================
CREATE TABLE AsignarOperario (
    codOperarioxTicket CHAR(8) PRIMARY KEY,
    idEmpleado         INT,
    codTicket          CHAR(8),
    FOREIGN KEY (idEmpleado) REFERENCES Empleado(idEmpleado),
    FOREIGN KEY (codTicket) REFERENCES Ticket(codTicket)
);

-- =======================================
-- 19. HERRAMIENTAS
-- =======================================
CREATE TABLE Herramienta (
    codHerramienta  CHAR(6) PRIMARY KEY,
    nombre          VARCHAR(20),
    marca           VARCHAR(20),
    modelo          VARCHAR(20),
    stock           INT
);

CREATE TABLE AsignarHerramienta (
    codAsignarHerramienta CHAR(8) PRIMARY KEY,
    codHerramienta        CHAR(6),
    codRampa              CHAR(8),
    FOREIGN KEY (codHerramienta) REFERENCES Herramienta(codHerramienta),
    FOREIGN KEY (codRampa) REFERENCES Rampa(codRampa)
);

-- =======================================
-- ROLES PREDEFINIDOS (Operario, Supervisor, Cliente)
-- =======================================
INSERT INTO Rol (nombreRol) VALUES 
('OPERARIO'),
('SUPERVISOR'),
('CLIENTE'),
('ADMINISTRADOR');

-- =======================================
-- TABLA ESTADO TICKET
-- =======================================
CREATE TABLE EstadoTicket (
    idEstadoTicket SERIAL PRIMARY KEY,
    nombreEstado   VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO EstadoTicket(nombreEstado) VALUES
('Pendiente'),
('En Proceso'),
('Finalizado'),
('Cancelado');

-- =======================================
-- TABLA ESTADO MANTENIMIENTO
-- =======================================
CREATE TABLE EstadoMantenimiento (
    idEstadoMantenimiento SERIAL PRIMARY KEY,
    nombreEstado          VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO EstadoMantenimiento(nombreEstado) VALUES
('Pendiente'),
('Diagnosticado'),
('Ejecución'),
('Finalizado'),
('Pagado');

-- =======================================
-- TIPO MANTENIMIENTO (Preventivo / Correctivo)
-- =======================================
CREATE TABLE TipoMantenimiento (
    idTipoMantenimiento SERIAL PRIMARY KEY,
    nombreTipo VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO TipoMantenimiento(nombreTipo) VALUES
('Preventivo'),
('Correctivo');

-- =======================================
-- ACTUALIZAR CATALOGO SERVICIOS
-- =======================================
ALTER TABLE CatalogoServicios
ADD COLUMN idTipoMantenimiento INT NOT NULL,
ADD FOREIGN KEY (idTipoMantenimiento) REFERENCES TipoMantenimiento(idTipoMantenimiento);

-- =======================================
-- ACTUALIZAR TICKET (Agregar cliente y vehículo)
-- =======================================
ALTER TABLE Ticket
ADD COLUMN dniCliente CHAR(8),
ADD COLUMN codVehiculo CHAR(8),
ADD FOREIGN KEY (dniCliente) REFERENCES Cliente(dniCliente),
ADD FOREIGN KEY (codVehiculo) REFERENCES Vehiculo(codVehiculo),
ADD FOREIGN KEY (estado) REFERENCES EstadoTicket(idEstadoTicket);

-- =======================================
-- TABLA DIAGNOSTICO
-- =======================================
CREATE TABLE Diagnostico (
    codDiagnostico    CHAR(8) PRIMARY KEY,
    codMantenimiento  CHAR(8),
    idOperario        INT NOT NULL,
    area              VARCHAR(40),   -- Frenos, Motor, Sistema eléctrico, ...
    problemas         VARCHAR(200),
    motivoDerivacion  VARCHAR(200),
    fechaRegistro     DATE,
    horaRegistro      TIME,
    FOREIGN KEY (codMantenimiento) REFERENCES Mantenimientos(codMantenimiento),
    FOREIGN KEY (idOperario) REFERENCES Empleado(idEmpleado)
);

-- =======================================
-- ACTUALIZAR MANTENIMIENTOS
-- =======================================
ALTER TABLE Mantenimientos
ADD COLUMN idEstadoMantenimiento INT,
ADD FOREIGN KEY (idEstadoMantenimiento) REFERENCES EstadoMantenimiento(idEstadoMantenimiento);
