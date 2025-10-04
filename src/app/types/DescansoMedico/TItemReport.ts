export type TItemReportDescansos = {
    nombre_colaborador?: string,
    fecha_otorgamiento?: string,
    fecha_inicio?: string,
    fecha_final?: string,
    total_dias?: number,
    tipo_descansomedico?: string,
    tipo_contingencia?: string,
    mes_devengado?: string,
    codigo_citt?: string
}

export type TItemReportSubsidios = {
    numero_documento?: string
    nombre_colaborador?: string
    fecha_ingreso?: string
    sede?: string
    mes_devengado_dm?: string
    tipo_contingencia?: string
    fecha_inicio_dm?: string
    fecha_final_dm?: string
    total_dias_dm?: string
    fecha_inicio_subsidio?: string
    fecha_final_subsidio?: string
    total_dias_subsidio?: string
}