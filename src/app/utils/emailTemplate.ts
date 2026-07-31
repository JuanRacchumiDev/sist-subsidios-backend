import { TDetalleEmail as TDetalleDescansoEmail } from "../types/DescansoMedico/TDetalleEmail";
import { TDetalleEmail as TDetalleCanjeEmail } from "../types/Canje/TDetalleEmail";
import { IPersona } from "../interfaces/Persona/IPersona";
import { IDetalleParametro } from "../interfaces/DetalleParametro/IDetalleParametro"

interface INewUserNotificationTemplateData {
  persona?: IPersona;
  perfil?: IDetalleParametro;
  username?: string;
  email?: string;
  password?: string;
  appUrl?: string;
}

export function newUserNotificationTemplate(
  data: INewUserNotificationTemplateData): string {

  const nombreCompleto = data.persona?.nombre_completo ||
    `${data.persona?.nombres || ''} ${data.persona?.apellido_paterno || ''} ${data.persona?.apellido_materno || ''}`.trim() ||
    'Usuario'

  const nombrePerfil = data.perfil?.nombre || 'Sin perfil asignado'
  const username = data.username || data.email || 'N/A'
  const password = data.password || '********'
  const appUrl = data.appUrl || '#'

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a la Plataforma</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
      <tr>
        <td align="center">
          
          <!-- Contenedor Principal (Tarjetas) -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Encabezado / Header -->
            <tr>
              <td style="background-color: #1e293b; padding: 32px 40px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                  ¡Bienvenido(a) a la plataforma!
                </h1>
                <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0 0;">
                  Se ha generado tu acceso al sistema
                </p>
              </td>
            </tr>

            <!-- Cuerpo del mensaje -->
            <tr>
              <td style="padding: 40px;">
                <p style="font-size: 16px; color: #334155; margin: 0 0 16px 0; line-height: 1.5;">
                  Hola, <strong style="color: #0f172a;">${nombreCompleto}</strong>:
                </p>
                <p style="font-size: 15px; color: #475569; margin: 0 0 28px 0; line-height: 1.6;">
                  Nos complace darte la bienvenida. Se ha creado exitosamente tu perfil de acceso a la plataforma con los siguientes detalles y credenciales de ingreso:
                </p>

                <!-- Caja de Credenciales -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 28px;">
                  <tr>
                    <td style="padding: 20px 24px;">
                      
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <!-- Perfil -->
                        <tr>
                          <td style="padding: 6px 0; font-size: 14px; color: #64748b; width: 35%;"><strong>Perfil asignado:</strong></td>
                          <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${nombrePerfil}</td>
                        </tr>
                        <!-- Usuario -->
                        <tr>
                          <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Usuario:</strong></td>
                          <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600; font-family: monospace; font-size: 15px;">${username}</td>
                        </tr>
                        <!-- Contraseña -->
                        <tr>
                          <td style="padding: 6px 0; font-size: 14px; color: #64748b;"><strong>Contraseña:</strong></td>
                          <td style="padding: 6px 0; font-size: 14px; color: #2563eb; font-weight: 700; font-family: monospace; font-size: 15px;">${password}</td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>

                <!-- Botón de Iniciar Sesión -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                  <tr>
                    <td align="center">
                      <a href="${appUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                        Iniciar Sesión en el Sistema &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Mensaje de Seguridad / Advertencia -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 16px;">
                  <tr>
                    <td style="font-size: 13px; color: #92400e; line-height: 1.5;">
                      <strong>Nota de seguridad:</strong> Te recomendamos cambiar tu contraseña una vez ingreses por primera vez al sistema para mantener tu cuenta resguardada.
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e5e7eb; padding: 20px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.4;">
                  Este es un mensaje automático, por favor no respondas a este correo.<br>
                  &copy; ${new Date().getFullYear()} Sistema de Gestión. Todos los derechos reservados.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
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