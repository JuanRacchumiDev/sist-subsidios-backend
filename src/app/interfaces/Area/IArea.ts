export interface IArea {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface AreaResponse {
    result: boolean
    message?: string
    data?: IArea | IArea[]
    error?: string
    status?: number
}