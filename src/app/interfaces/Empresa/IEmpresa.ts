export interface IEmpresa {
    id?: string
    numero?: string
    nombre_o_razon_social?: string
    tipo_contribuyente?: string
    estado_sunat?: string
    condicion_sunat?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    direccion_completa?: string
    ubigeo_sunat?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface EmpresaResponse {
    result: boolean
    message?: string
    data?: IEmpresa | IEmpresa[]
    error?: string
    status?: number
}

export interface IEmpresaPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface EmpresaResponsePaginate {
    result: boolean
    message?: string
    data?: IEmpresa[]
    pagination?: IEmpresaPaginate
    error?: string
    status?: number
}