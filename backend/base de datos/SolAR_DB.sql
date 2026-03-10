-- ============================================================
--  SolAR Soluciones – Script de Base de Datos
--  Motor: SQL Server 2019+
--  Versión: 2.0 (Simulador con 3 opciones de ahorro)
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SolAR_DB')
BEGIN
    CREATE DATABASE SolAR_DB
    COLLATE Modern_Spanish_CI_AI;
END
GO

USE SolAR_DB;
GO

-- ============================================================
--  MÓDULO 1 – USUARIOS / ADMINISTRACIÓN
-- ============================================================

CREATE TABLE Usuarios (
    Id              INT           NOT NULL IDENTITY(1,1),
    Nombre          NVARCHAR(100) NOT NULL,
    Email           NVARCHAR(150) NOT NULL,
    PasswordHash    NVARCHAR(300) NOT NULL,
    Rol             NVARCHAR(30)  NOT NULL CONSTRAINT DF_Usuarios_Rol DEFAULT 'Editor',
    Activo          BIT           NOT NULL CONSTRAINT DF_Usuarios_Activo DEFAULT 1,
    FechaCreacion   DATETIME      NOT NULL CONSTRAINT DF_Usuarios_FechaCreacion DEFAULT GETDATE(),
    UltimoLogin     DATETIME      NULL,

    CONSTRAINT PK_Usuarios        PRIMARY KEY (Id),
    CONSTRAINT UQ_Usuarios_Email  UNIQUE (Email),
    CONSTRAINT CK_Usuarios_Rol    CHECK (Rol IN ('Admin', 'Editor', 'Comercial'))
);
GO


-- ============================================================
--  MÓDULO 2 – LEADS Y CONTACTOS
--  Incluye la opción de ahorro elegida en el simulador
-- ============================================================

CREATE TABLE Leads (
    Id                      INT           NOT NULL IDENTITY(1,1),
    Nombre                  NVARCHAR(100) NOT NULL,
    Email                   NVARCHAR(150) NOT NULL,
    Telefono                NVARCHAR(20)  NULL,
    Ciudad                  NVARCHAR(100) NULL,
    Provincia               NVARCHAR(100) NULL,
    TipoPropiedad           NVARCHAR(20)  NULL,
    ConsumoAproximadoKwh    DECIMAL(10,2) NULL,
    MontoFactura            DECIMAL(12,2) NULL,

    -- Opción elegida en el simulador (viene pre-cargada al hacer clic en "Quiero este")
    OpcionSimuladorElegida  NVARCHAR(10)  NULL,   -- '100%' | '50%' | '25%' | NULL si no usó simulador
    SimulacionId            INT           NULL,   -- FK a la simulación que generó este lead

    Mensaje                 NVARCHAR(MAX) NULL,
    Origen                  NVARCHAR(50)  NOT NULL CONSTRAINT DF_Leads_Origen DEFAULT 'Formulario',
    Estado                  NVARCHAR(30)  NOT NULL CONSTRAINT DF_Leads_Estado DEFAULT 'Nuevo',
    FechaCreacion           DATETIME      NOT NULL CONSTRAINT DF_Leads_FechaCreacion DEFAULT GETDATE(),
    FechaActualizacion      DATETIME      NULL,

    CONSTRAINT PK_Leads               PRIMARY KEY (Id),
    CONSTRAINT CK_Leads_TipoPropiedad CHECK (TipoPropiedad IN ('Hogar', 'Comercio', 'Empresa')),
    CONSTRAINT CK_Leads_Origen        CHECK (Origen IN ('Formulario', 'Simulador', 'WhatsApp', 'Otro')),
    CONSTRAINT CK_Leads_Estado        CHECK (Estado IN ('Nuevo', 'Contactado', 'EnProceso', 'Cerrado', 'Descartado')),
    CONSTRAINT CK_Leads_Opcion        CHECK (OpcionSimuladorElegida IN ('100%', '50%', '25%') OR OpcionSimuladorElegida IS NULL)
);
GO

CREATE INDEX IX_Leads_Estado    ON Leads (Estado);
CREATE INDEX IX_Leads_Origen    ON Leads (Origen);
CREATE INDEX IX_Leads_Provincia ON Leads (Provincia);
CREATE INDEX IX_Leads_Fecha     ON Leads (FechaCreacion DESC);
GO


-- ============================================================
--  MÓDULO 3 – SIMULADOR SOLAR
--  Guarda las 3 opciones calculadas en una sola fila por simulación.
--  El precio exacto NO se almacena aquí porque no se muestra al usuario.
-- ============================================================

-- Parámetros configurables por provincia (los actualiza el admin cuando cambian precios)
CREATE TABLE ParametrosSimulador (
    Id                   INT           NOT NULL IDENTITY(1,1),
    Provincia            NVARCHAR(100) NOT NULL,
    HorasSolPicoDiarias  DECIMAL(4,2)  NOT NULL,  -- HSP promedio diarias. Ej: 5.20
    PrecioKwhRed         DECIMAL(8,4)  NOT NULL,  -- $/kWh de la red eléctrica
    CostoPorWpInstalado  DECIMAL(10,2) NOT NULL,  -- $ por Wp instalado (base para calcular rango de retorno)
    EficienciaSistema    DECIMAL(4,2)  NOT NULL CONSTRAINT DF_Params_Eficiencia DEFAULT 0.80,  -- 80% típico
    FactorCO2KgPorKwh    DECIMAL(6,4)  NOT NULL CONSTRAINT DF_Params_CO2       DEFAULT 0.3200, -- kg CO2/kWh
    WpPorPanel           INT           NOT NULL CONSTRAINT DF_Params_WpPanel   DEFAULT 400,    -- Wp por panel
    M2PorPanel           DECIMAL(4,2)  NOT NULL CONSTRAINT DF_Params_M2Panel   DEFAULT 2.00,   -- m² por panel
    FechaActualizacion   DATETIME      NOT NULL CONSTRAINT DF_Params_Fecha     DEFAULT GETDATE(),

    CONSTRAINT PK_ParametrosSimulador PRIMARY KEY (Id),
    CONSTRAINT UQ_Params_Provincia    UNIQUE (Provincia)
);
GO

-- Una fila por uso del simulador; almacena las 3 opciones calculadas
CREATE TABLE SimulacionesSolares (
    Id                    INT           NOT NULL IDENTITY(1,1),
    LeadId                INT           NULL,  -- Se vincula después, cuando el usuario envía el formulario

    -- Datos ingresados por el usuario
    Provincia             NVARCHAR(100) NOT NULL,
    TipoPropiedad         NVARCHAR(20)  NOT NULL,
    ConsumoMensualKwh     DECIMAL(10,2) NOT NULL,
    MontoFacturaMensual   DECIMAL(12,2) NULL,

    -- ── OPCIÓN 100% de ahorro ─────────────────────────────────────────
    Op100_SistemaKw       DECIMAL(6,2)  NOT NULL,
    Op100_Paneles         INT           NOT NULL,
    Op100_SuperficieM2    DECIMAL(8,2)  NOT NULL,
    Op100_AhorroMensual   DECIMAL(12,2) NOT NULL,
    Op100_AhorroAnual     DECIMAL(12,2) NOT NULL,
    Op100_RetornoMinAnios DECIMAL(4,1)  NOT NULL,  -- Rango: mínimo (ej: 5)
    Op100_RetornoMaxAnios DECIMAL(4,1)  NOT NULL,  -- Rango: máximo (ej: 7)
    Op100_CO2AnualTn      DECIMAL(8,2)  NOT NULL,
    Op100_Arboles         INT           NOT NULL,

    -- ── OPCIÓN 50% de ahorro ──────────────────────────────────────────
    Op50_SistemaKw        DECIMAL(6,2)  NOT NULL,
    Op50_Paneles          INT           NOT NULL,
    Op50_SuperficieM2     DECIMAL(8,2)  NOT NULL,
    Op50_AhorroMensual    DECIMAL(12,2) NOT NULL,
    Op50_AhorroAnual      DECIMAL(12,2) NOT NULL,
    Op50_RetornoMinAnios  DECIMAL(4,1)  NOT NULL,
    Op50_RetornoMaxAnios  DECIMAL(4,1)  NOT NULL,
    Op50_CO2AnualTn       DECIMAL(8,2)  NOT NULL,
    Op50_Arboles          INT           NOT NULL,

    -- ── OPCIÓN 25% de ahorro ──────────────────────────────────────────
    Op25_SistemaKw        DECIMAL(6,2)  NOT NULL,
    Op25_Paneles          INT           NOT NULL,
    Op25_SuperficieM2     DECIMAL(8,2)  NOT NULL,
    Op25_AhorroMensual    DECIMAL(12,2) NOT NULL,
    Op25_AhorroAnual      DECIMAL(12,2) NOT NULL,
    Op25_RetornoMinAnios  DECIMAL(4,1)  NOT NULL,
    Op25_RetornoMaxAnios  DECIMAL(4,1)  NOT NULL,
    Op25_CO2AnualTn       DECIMAL(8,2)  NOT NULL,
    Op25_Arboles          INT           NOT NULL,

    -- Metadata
    FechaSimulacion       DATETIME      NOT NULL CONSTRAINT DF_Simulacion_Fecha DEFAULT GETDATE(),
    IpUsuario             NVARCHAR(50)  NULL,

    CONSTRAINT PK_SimulacionesSolares PRIMARY KEY (Id),
    CONSTRAINT FK_Simulacion_Lead     FOREIGN KEY (LeadId) REFERENCES Leads (Id),
    CONSTRAINT CK_Simulacion_TipoProp CHECK (TipoPropiedad IN ('Hogar', 'Comercio', 'Empresa'))
);
GO

-- FK cruzada: Lead sabe de qué simulación vino
ALTER TABLE Leads
    ADD CONSTRAINT FK_Lead_Simulacion
    FOREIGN KEY (SimulacionId) REFERENCES SimulacionesSolares (Id);
GO

CREATE INDEX IX_Simulacion_Lead  ON SimulacionesSolares (LeadId);
CREATE INDEX IX_Simulacion_Fecha ON SimulacionesSolares (FechaSimulacion DESC);
GO


-- ============================================================
--  MÓDULO 4 – PROYECTOS / CASOS REALES
-- ============================================================

CREATE TABLE Proyectos (
    Id                 INT           NOT NULL IDENTITY(1,1),
    Titulo             NVARCHAR(200) NOT NULL,
    TipoCliente        NVARCHAR(20)  NOT NULL,
    Provincia          NVARCHAR(100) NOT NULL,
    Ciudad             NVARCHAR(100) NULL,
    SistemaInstaladoKw DECIMAL(6,2)  NOT NULL,
    PanelesInstalados  INT           NOT NULL,
    FacturaAntes       DECIMAL(12,2) NULL,
    FacturaDespues     DECIMAL(12,2) NULL,
    PorcentajeAhorro   DECIMAL(5,2)  NULL,
    Descripcion        NVARCHAR(MAX) NULL,
    Destacado          BIT           NOT NULL CONSTRAINT DF_Proyectos_Destacado      DEFAULT 0,
    Activo             BIT           NOT NULL CONSTRAINT DF_Proyectos_Activo         DEFAULT 1,
    FechaInstalacion   DATE          NULL,
    FechaCreacion      DATETIME      NOT NULL CONSTRAINT DF_Proyectos_FechaCreacion  DEFAULT GETDATE(),

    CONSTRAINT PK_Proyectos             PRIMARY KEY (Id),
    CONSTRAINT CK_Proyectos_TipoCliente CHECK (TipoCliente IN ('Hogar', 'Comercio', 'Empresa'))
);
GO

CREATE TABLE ProyectoImagenes (
    Id          INT           NOT NULL IDENTITY(1,1),
    ProyectoId  INT           NOT NULL,
    UrlImagen   NVARCHAR(500) NOT NULL,
    EsPrincipal BIT           NOT NULL CONSTRAINT DF_ProjImg_Principal DEFAULT 0,
    Orden       INT           NOT NULL CONSTRAINT DF_ProjImg_Orden     DEFAULT 1,

    CONSTRAINT PK_ProyectoImagenes PRIMARY KEY (Id),
    CONSTRAINT FK_ProjImg_Proyecto FOREIGN KEY (ProyectoId) REFERENCES Proyectos (Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_ProjImg_Proyecto ON ProyectoImagenes (ProyectoId);
GO


-- ============================================================
--  MÓDULO 5 – BLOG
-- ============================================================

CREATE TABLE BlogCategorias (
    Id      INT           NOT NULL IDENTITY(1,1),
    Nombre  NVARCHAR(100) NOT NULL,
    Slug    NVARCHAR(100) NOT NULL,
    Activo  BIT           NOT NULL CONSTRAINT DF_BlogCat_Activo DEFAULT 1,

    CONSTRAINT PK_BlogCategorias PRIMARY KEY (Id),
    CONSTRAINT UQ_BlogCat_Slug   UNIQUE (Slug)
);
GO

CREATE TABLE BlogArticulos (
    Id               INT           NOT NULL IDENTITY(1,1),
    CategoriaId      INT           NOT NULL,
    AutorId          INT           NOT NULL,
    Titulo           NVARCHAR(300) NOT NULL,
    Slug             NVARCHAR(300) NOT NULL,
    Resumen          NVARCHAR(500) NULL,
    Contenido        NVARCHAR(MAX) NOT NULL,
    ImagenPortada    NVARCHAR(500) NULL,
    MetaTitle        NVARCHAR(200) NULL,
    MetaDescription  NVARCHAR(300) NULL,
    Publicado        BIT           NOT NULL CONSTRAINT DF_BlogArt_Publicado     DEFAULT 0,
    FechaPublicacion DATETIME      NULL,
    FechaCreacion    DATETIME      NOT NULL CONSTRAINT DF_BlogArt_FechaCreacion DEFAULT GETDATE(),

    CONSTRAINT PK_BlogArticulos     PRIMARY KEY (Id),
    CONSTRAINT UQ_BlogArt_Slug      UNIQUE (Slug),
    CONSTRAINT FK_BlogArt_Categoria FOREIGN KEY (CategoriaId) REFERENCES BlogCategorias (Id),
    CONSTRAINT FK_BlogArt_Autor     FOREIGN KEY (AutorId)     REFERENCES Usuarios (Id)
);
GO

CREATE INDEX IX_BlogArt_Slug      ON BlogArticulos (Slug);
CREATE INDEX IX_BlogArt_Publicado ON BlogArticulos (Publicado, FechaPublicacion DESC);
CREATE INDEX IX_BlogArt_Categoria ON BlogArticulos (CategoriaId);
GO


-- ============================================================
--  MÓDULO 6 – ANALYTICS INTERNO
-- ============================================================

CREATE TABLE EventosWeb (
    Id          BIGINT        NOT NULL IDENTITY(1,1),
    TipoEvento  NVARCHAR(50)  NOT NULL,
    Pagina      NVARCHAR(200) NULL,
    IpUsuario   NVARCHAR(50)  NULL,
    UserAgent   NVARCHAR(500) NULL,
    FechaEvento DATETIME      NOT NULL CONSTRAINT DF_Eventos_Fecha DEFAULT GETDATE(),

    CONSTRAINT PK_EventosWeb   PRIMARY KEY (Id),
    CONSTRAINT CK_Eventos_Tipo CHECK (TipoEvento IN (
        'SimuladorUsado',     -- Alguien calculó las 3 opciones
        'OpcionElegida100',   -- Hizo clic en "Quiero este" del 100%
        'OpcionElegida50',    -- Hizo clic en "Quiero este" del 50%
        'OpcionElegida25',    -- Hizo clic en "Quiero este" del 25%
        'FormularioEnviado',
        'BotonCotizacion',
        'BotonWhatsApp',
        'VistaProyecto',
        'VistaArticulo',
        'Otro'
    ))
);
GO

CREATE INDEX IX_Eventos_Tipo  ON EventosWeb (TipoEvento);
CREATE INDEX IX_Eventos_Fecha ON EventosWeb (FechaEvento DESC);
GO


-- ============================================================
--  DATOS INICIALES – ParametrosSimulador (24 provincias argentinas)
--
--  Fórmulas que usará el backend para cada opción (100%, 50%, 25%):
--
--  kWp = (ConsumoKwh × PctAhorro) / (HSP × 30 × Eficiencia)
--  Paneles       = CEILING(kWp × 1000 / WpPorPanel)
--  Superficie    = Paneles × M2PorPanel
--  AhorroMensual = ConsumoKwh × PctAhorro × PrecioKwhRed
--  AhorroAnual   = AhorroMensual × 12
--  RetornoMin    = (kWp×1000 × CostoPorWpInstalado × 0.90) / AhorroAnual
--  RetornoMax    = (kWp×1000 × CostoPorWpInstalado × 1.10) / AhorroAnual
--  CO2_tn_año    = (kWp × HSP × 365 × Eficiencia × FactorCO2) / 1000
--  Arboles       = ROUND(CO2_tn_año × 1000 / 21, 0)
-- ============================================================

INSERT INTO ParametrosSimulador
    (Provincia, HorasSolPicoDiarias, PrecioKwhRed, CostoPorWpInstalado, EficienciaSistema, FactorCO2KgPorKwh, WpPorPanel, M2PorPanel)
VALUES
    ('Buenos Aires',        4.50, 120.0000, 850.00, 0.80, 0.3200, 400, 2.00),
    ('CABA',                4.40, 130.0000, 870.00, 0.80, 0.3200, 400, 2.00),
    ('Córdoba',             5.20, 115.0000, 830.00, 0.80, 0.3200, 400, 2.00),
    ('Mendoza',             5.80, 110.0000, 820.00, 0.82, 0.3200, 400, 2.00),
    ('Santa Fe',            4.80, 118.0000, 840.00, 0.80, 0.3200, 400, 2.00),
    ('Tucumán',             5.50, 105.0000, 800.00, 0.81, 0.3200, 400, 2.00),
    ('Salta',               5.70, 100.0000, 800.00, 0.81, 0.3200, 400, 2.00),
    ('Entre Ríos',          4.60, 112.0000, 835.00, 0.80, 0.3200, 400, 2.00),
    ('Chaco',               5.30, 100.0000, 800.00, 0.80, 0.3200, 400, 2.00),
    ('Misiones',            4.90, 105.0000, 810.00, 0.79, 0.3200, 400, 2.00),
    ('Santiago del Estero', 5.60, 100.0000, 800.00, 0.81, 0.3200, 400, 2.00),
    ('San Juan',            6.20, 100.0000, 800.00, 0.83, 0.3200, 400, 2.00),
    ('Jujuy',               5.90, 100.0000, 800.00, 0.82, 0.3200, 400, 2.00),
    ('Río Negro',           4.70, 108.0000, 830.00, 0.80, 0.3200, 400, 2.00),
    ('Neuquén',             4.80, 108.0000, 830.00, 0.80, 0.3200, 400, 2.00),
    ('Formosa',             5.40, 100.0000, 800.00, 0.80, 0.3200, 400, 2.00),
    ('Corrientes',          5.10, 105.0000, 810.00, 0.80, 0.3200, 400, 2.00),
    ('La Pampa',            5.00, 105.0000, 820.00, 0.80, 0.3200, 400, 2.00),
    ('Chubut',              4.50, 105.0000, 825.00, 0.79, 0.3200, 400, 2.00),
    ('San Luis',            5.50, 105.0000, 815.00, 0.81, 0.3200, 400, 2.00),
    ('Catamarca',           6.00, 100.0000, 800.00, 0.82, 0.3200, 400, 2.00),
    ('La Rioja',            6.10, 100.0000, 800.00, 0.82, 0.3200, 400, 2.00),
    ('Santa Cruz',          4.20, 100.0000, 830.00, 0.79, 0.3200, 400, 2.00),
    ('Tierra del Fuego',    3.80, 100.0000, 840.00, 0.78, 0.3200, 400, 2.00);
GO


-- ============================================================
--  DATOS INICIALES – Usuario Admin
--  ⚠️  Reemplazar 'CAMBIAR_POR_HASH_REAL' con el hash bcrypt del password
-- ============================================================

INSERT INTO Usuarios (Nombre, Email, PasswordHash, Rol)
VALUES ('Administrador', 'admin@solarsoluciones.com', 'CAMBIAR_POR_HASH_REAL', 'Admin');
GO


-- ============================================================
--  DATOS INICIALES – Categorías del Blog
-- ============================================================

INSERT INTO BlogCategorias (Nombre, Slug) VALUES
    ('Ahorro Energético',       'ahorro-energetico'),
    ('Instalaciones',           'instalaciones'),
    ('Financiamiento',          'financiamiento'),
    ('Energía Solar Argentina', 'energia-solar-argentina'),
    ('Novedades',               'novedades');
GO


-- ============================================================
--  DATOS INICIALES – Proyectos de ejemplo
-- ============================================================

INSERT INTO Proyectos
    (Titulo, TipoCliente, Provincia, Ciudad, SistemaInstaladoKw, PanelesInstalados,
     FacturaAntes, FacturaDespues, PorcentajeAhorro, Descripcion, Destacado, Activo, FechaInstalacion)
VALUES
    ('Vivienda familiar – Palermo',  'Hogar',   'CABA',     'Palermo',    4.00,  10,  120000,  20000, 83.33, 'Sistema de 4 kW instalado en vivienda unifamiliar con techo orientado al norte.',   1, 1, '2024-03-15'),
    ('Supermercado de barrio',       'Comercio','Córdoba',  'Córdoba',   15.00,  38,  450000,  80000, 82.22, 'Sistema de 15 kW para supermercado con alto consumo diurno.',                      1, 1, '2024-06-20'),
    ('Vivienda – Godoy Cruz',        'Hogar',   'Mendoza',  'Godoy Cruz', 5.00,  13,  100000,  15000, 85.00, 'Instalación en zona de alta irradiación solar. Sistema con batería de respaldo.',   1, 1, '2024-09-10'),
    ('Nave industrial – Rosario',    'Empresa', 'Santa Fe', 'Rosario',   50.00, 125, 1500000, 200000, 86.67, 'Sistema de gran escala en nave industrial de 2.000 m².',                            0, 1, '2025-01-05');
GO


-- ============================================================
--  VISTA – Panel comercial: leads con los datos de su opción elegida
--  Esto es lo que ve el vendedor cuando recibe un nuevo lead
-- ============================================================

CREATE VIEW vw_LeadsComercial AS
SELECT
    l.Id                        AS LeadId,
    l.FechaCreacion,
    l.Estado,
    l.Nombre,
    l.Email,
    l.Telefono,
    l.Provincia,
    l.TipoPropiedad,
    l.ConsumoAproximadoKwh,
    l.MontoFactura,
    l.Origen,
    l.OpcionSimuladorElegida,
    l.Mensaje,
    -- Datos técnicos de la opción que eligió (para que el vendedor llegue preparado)
    CASE l.OpcionSimuladorElegida
        WHEN '100%' THEN s.Op100_SistemaKw
        WHEN '50%'  THEN s.Op50_SistemaKw
        WHEN '25%'  THEN s.Op25_SistemaKw
    END                         AS SistemaKw_Elegido,
    CASE l.OpcionSimuladorElegida
        WHEN '100%' THEN s.Op100_Paneles
        WHEN '50%'  THEN s.Op50_Paneles
        WHEN '25%'  THEN s.Op25_Paneles
    END                         AS Paneles_Elegidos,
    CASE l.OpcionSimuladorElegida
        WHEN '100%' THEN s.Op100_AhorroMensual
        WHEN '50%'  THEN s.Op50_AhorroMensual
        WHEN '25%'  THEN s.Op25_AhorroMensual
    END                         AS AhorroMensual_Estimado,
    CASE l.OpcionSimuladorElegida
        WHEN '100%' THEN s.Op100_RetornoMinAnios
        WHEN '50%'  THEN s.Op50_RetornoMinAnios
        WHEN '25%'  THEN s.Op25_RetornoMinAnios
    END                         AS RetornoMin_Anios,
    CASE l.OpcionSimuladorElegida
        WHEN '100%' THEN s.Op100_RetornoMaxAnios
        WHEN '50%'  THEN s.Op50_RetornoMaxAnios
        WHEN '25%'  THEN s.Op25_RetornoMaxAnios
    END                         AS RetornoMax_Anios
FROM Leads l
LEFT JOIN SimulacionesSolares s ON s.Id = l.SimulacionId;
GO


-- ============================================================
--  VISTA – Qué opción de ahorro elige la gente (para analítica)
-- ============================================================

CREATE VIEW vw_OpcionesElegidas AS
SELECT
    OpcionSimuladorElegida                                            AS Opcion,
    COUNT(*)                                                          AS TotalLeads,
    CAST(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS DECIMAL(5,2))   AS PorcentajeDelTotal
FROM Leads
WHERE OpcionSimuladorElegida IS NOT NULL
GROUP BY OpcionSimuladorElegida;
GO


-- ============================================================
--  VISTA – Estadísticas generales del simulador
-- ============================================================

CREATE VIEW vw_EstadisticasSimulador AS
SELECT
    CAST(FechaSimulacion AS DATE) AS Dia,
    Provincia,
    TipoPropiedad,
    COUNT(*)                      AS TotalSimulaciones,
    AVG(ConsumoMensualKwh)        AS ConsumoPromedioKwh
FROM SimulacionesSolares
GROUP BY CAST(FechaSimulacion AS DATE), Provincia, TipoPropiedad;
GO


PRINT '=========================================================';
PRINT ' SolAR_DB v2.0 creada exitosamente';
PRINT '---------------------------------------------------------';
PRINT ' Tablas (9):';
PRINT '   Usuarios, Leads, ParametrosSimulador,';
PRINT '   SimulacionesSolares, Proyectos, ProyectoImagenes,';
PRINT '   BlogCategorias, BlogArticulos, EventosWeb';
PRINT ' Vistas (3):';
PRINT '   vw_LeadsComercial';
PRINT '   vw_OpcionesElegidas';
PRINT '   vw_EstadisticasSimulador';
PRINT '=========================================================';
GO
