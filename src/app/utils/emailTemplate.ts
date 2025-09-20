import { TDetalleEmail as TDetalleDescansoEmail } from "../types/DescansoMedico/TDetalleEmail";
import { TDetalleEmail as TDetalleCanjeEmail } from "../types/Canje/TDetalleEmail";

export function newUserNotificationTemplate(
  data: {
    name: string;
    email: string;
    temporaryPassword: string;
    appUrl: string
  }): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
        <div style="background-color: #4a5568; padding: 24px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; margin: 0;">¡Bienvenido(a) a la plataforma!</h1>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #4a5568;">Hola, <strong>${data.name}</strong>,</p>
          <p style="font-size: 16px; color: #4a5568;">Se ha creado una cuenta de usuario para ti en nuestra plataforma. A continuación, encontrarás tus credenciales de acceso temporal:</p>
          
          <div style="margin-top: 20px; margin-bottom: 20px; padding: 16px; background-color: #e2e8f0; border-radius: 6px;">
            <p style="font-size: 16px; color: #2d3748; margin-bottom: 8px;"><strong>Correo electrónico:</strong> ${data.email}</p>
            <p style="font-size: 16px; color: #2d3748;"><strong>Contraseña temporal:</strong> ${data.temporaryPassword}</p>
          </div>
          
          <p style="font-size: 16px; color: #4a5568;">Para acceder, haz clic en el siguiente enlace:</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${data.appUrl}" style="background-color: #48bb78; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Acceder a la plataforma</a>
          </div>
          
          <p style="font-size: 14px; color: #718096; margin-top: 32px;">Por favor, cambia tu contraseña después del primer inicio de sesión por seguridad.</p>
        </div>
      </div>
    </div>
  `;
}

export function newNotificationDescansoMedico(
  data: {
    nombreCompleto: string;
    appUrl: string
  }): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
        <div style="background-color: #4a5568; padding: 24px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; margin: 0;">¡Bienvenido(a) a la plataforma!</h1>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #4a5568;">Estimado colaborador, <strong>${data.nombreCompleto}</strong>,</p>
          <p style="font-size: 16px; color: #4a5568;">Hemos recibido su documentación, la estaremos revisando y enviaremos la respuesta en los próximos días.</p>
          <p style="font-size: 16px; color: #4a5568;">Gracias</p>
          <p style="font-size: 16px; color: #4a5568;">Saludos,</p>
          <p style="font-size: 16px; color: #4a5568;">Equipo de Subsidios</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${data.appUrl}" style="background-color: #48bb78; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Acceder a la plataforma</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function notificationDescansoMedicoIncorrecto(
  data: {
    nombreCompleto: string;
    detalle: TDetalleDescansoEmail
    appUrl: string,
  }): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
        <div style="background-color: #4a5568; padding: 24px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; margin: 0;">¡Bienvenido(a) a la plataforma!</h1>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #4a5568;">Estimado colaborador, <strong>${data.nombreCompleto}</strong>,</p>
          <p style="font-size: 16px; color: #4a5568;">La documentación agregada del siguiente descanso médico, es incorrecta. Por favor subsanar en el menor tiempo posible</p>
          <p style="font-size: 16px; color: #4a5568;">A continuación se detalle el descanso médico</p>
          <p style="font-size: 16px; color: #4a5568;">Tipo de descanso médico: <strong>${data.detalle.nombre_tipodescansomedico}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Tipo de contingencia: <strong>${data.detalle.nombre_tipocontingencia}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Diagnóstico: <strong>${data.detalle.nombre_diagnostico}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Establecimiento: <strong>${data.detalle.nombre_establecimiento}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Fecha inicio: <strong>${data.detalle.fecha_inicio}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Fecha final: <strong>${data.detalle.fecha_final}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Observación: <strong>${data.detalle.observacion}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Gracias</p>
          <p style="font-size: 16px; color: #4a5568;">Saludos,</p>
          <p style="font-size: 16px; color: #4a5568;">Equipo de Subsidios</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${data.appUrl}" style="background-color: #48bb78; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Acceder a la plataforma</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function notificationCanjeObservado(
  data: {
    nombreCompleto: string;
    detalle: TDetalleCanjeEmail
    appUrl: string,
  }): string {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
        <div style="background-color: #4a5568; padding: 24px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; margin: 0;">¡Bienvenido(a) a la plataforma!</h1>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #4a5568;">Estimado colaborador, <strong>${data.nombreCompleto}</strong>,</p>
          <p style="font-size: 16px; color: #4a5568;">La documentación agregada del siguiente canje, está observada. Por favor subsanar en el menor tiempo posible</p>
          <p style="font-size: 16px; color: #4a5568;">A continuación se detalle el canje</p>
          <p style="font-size: 16px; color: #4a5568;">Fecha inicio subsidio: <strong>${data.detalle.fecha_inicio_subsidio}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Fecha final subsidio: <strong>${data.detalle.fecha_final_subsidio}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Observación: <strong>${data.detalle.observacion}</strong></p>
          
          <p style="font-size: 16px; color: #4a5568;">Fecha inicio descanso médico: <strong>${data.detalle.descansoMedico?.fecha_inicio}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Fecha final descanso médico: <strong>${data.detalle.descansoMedico?.fecha_final}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Tipo de descanso médico: <strong>${data.detalle.descansoMedico?.nombre_tipodescansomedico}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Tipo de contingencia: <strong>${data.detalle.descansoMedico?.nombre_tipocontingencia}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Diagnóstico: <strong>${data.detalle.descansoMedico?.nombre_diagnostico}</strong></p>
          <p style="font-size: 16px; color: #4a5568;">Establecimiento: <strong>${data.detalle.descansoMedico?.nombre_establecimiento}</strong></p>
          
          <p style="font-size: 16px; color: #4a5568;">Gracias</p>
          <p style="font-size: 16px; color: #4a5568;">Saludos,</p>
          <p style="font-size: 16px; color: #4a5568;">Equipo de Subsidios</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${data.appUrl}" style="background-color: #48bb78; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Acceder a la plataforma</a>
          </div>
        </div>
      </div>
    </div>
  `;
}