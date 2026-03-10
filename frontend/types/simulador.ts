export interface OpcionSimulacion {
  porcentaje: string;
  sistemaKw: number;
  paneles: number;
  superficieM2: number;
  ahorroMensual: number;
  ahorroAnual: number;
  retornoMinAnios: number;
  retornoMaxAnios: number;
  cO2AnualTn: number;
  arboles: number;
}

export interface SimulacionResult {
  simulacionId: number;
  provincia: string;
  consumoMensualKwh: number;
  opcion100: OpcionSimulacion;
  opcion50: OpcionSimulacion;
  opcion25: OpcionSimulacion;
}

export interface LeadRequest {
  nombre: string;
  email: string;
  telefono: string;
  ciudad?: string;
  provincia: string;
  tipoPropiedad?: string;
  consumoAproximadoKwh?: number;
  opcionSimuladorElegida?: string;
  simulacionId?: number;
  mensaje?: string;
  origen: string;
}
