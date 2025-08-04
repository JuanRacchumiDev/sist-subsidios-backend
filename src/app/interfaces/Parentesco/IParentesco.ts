export interface IParentesco {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface ParentescoResponse {
    result: boolean
    message?: string
    data?: IParentesco | IParentesco[]
    error?: string
    status?: number
}