import { TDetalleEmail, TDetalleDescansoMedico, TDetalleCanje, TDetalleReembolso } from '../types/TDetalleEmail'
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

interface INotificationDescansoMedicoIncorrectoProps {
  nombreCompleto: string;
  detalle: TDetalleDescansoMedico | TDetalleEmail['descansoMedico'];
  appUrl: string;
}

interface INotificationCanjeObservadoProps {
  nombreCompleto: string;
  detalle: TDetalleCanje | TDetalleEmail['canje'];
  appUrl: string;
}

interface INotificationReembolsoObservadoProps {
  nombreCompleto: string
  detalle: TDetalleReembolso | TDetalleEmail['reembolso']
  appUrl: string
}

export function newUserNotificationTemplate(
  data: INewUserNotificationTemplateData
): string {
  const nombreCompleto =
    data.persona?.nombre_completo ||
    `${data.persona?.nombres || ""} ${data.persona?.apellido_paterno || ""} ${data.persona?.apellido_materno || ""}`.trim() ||
    "Usuario";

  const nombrePerfil = data.perfil?.nombre || "Sin perfil asignado";
  const username = data.username || "N/A";
  const email = data.email || "N/A";

  // Determinamos el origen o valor de la contraseña recibida
  const passwordDisplay = data.password || "Consulte con el administrador";
  const esDocumento = Boolean(data.persona?.numero_documento && data.password === data.persona.numero_documento);

  const tipoPasswordEtiqueta = esDocumento
    ? "N° Documento (Contraseña inicial):"
    : "Contraseña temporal:";

  const appUrl = data.appUrl || "#";

  return `
  <!DOCTYPE html>
  <html lang="es" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Bienvenido a la Plataforma</title>
    <style>
      /* Resets para asegurar cero scroll horizontal */
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      /* Prevenir desbordamientos de texto largo */
      .break-word {
        word-break: break-word !important;
        overflow-wrap: break-word !important;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 24px 12px;">
      <tr>
        <td align="center">
          
          <!-- Contenedor Principal Responsive -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); table-layout: fixed;">
            
            <!-- Header Banner (Estilo Slate-900 / Tailwind) -->
            <tr>
              <td style="background-color: #0f172a; padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.025em; line-height: 1.3;">
                  ¡Bienvenido(a) a la Plataforma!
                </h1>
                <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0 0; line-height: 1.4;">
                  Tus credenciales de acceso han sido creadas exitosamente
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px 24px;" class="break-word">
                
                <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0; line-height: 1.5;">
                  Hola, <strong style="color: #0f172a;">${nombreCompleto}</strong>:
                </p>
                
                <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
                  Te informamos que tu perfil de acceso ya se encuentra habilitado en el sistema. A continuación encontrarás el resumen de tu cuenta:
                </p>

                <!-- Card de Credenciales -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; table-layout: fixed;">
                  <tr>
                    <td style="padding: 20px;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        
                        <!-- Perfil -->
                        <tr>
                          <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600; width: 40%; vertical-align: top;">
                            Perfil asignado:
                          </td>
                          <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600; width: 60%; vertical-align: top;" class="break-word">
                            ${nombrePerfil}
                          </td>
                        </tr>

                        <!-- Usuario -->
                        <tr>
                          <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600; vertical-align: top;">
                            Usuario / Correo:
                          </td>
                          <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; vertical-align: top;" class="break-word">
                            ${username} / ${email}
                          </td>
                        </tr>

                        <!-- Contraseña (Documento o Código) -->
                        <tr>
                          <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600; vertical-align: top;" class="break-word">
                            ${tipoPasswordEtiqueta}
                          </td>
                          <td style="padding: 6px 0; font-size: 14px; color: #2563eb; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; vertical-align: top;" class="break-word">
                            ${passwordDisplay}
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Call to Action Button -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${appUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); text-align: center;">
                        Ingresar al Sistema &rarr;
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Callout Banner de Advertencia -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px;">
                  <tr>
                    <td style="padding: 12px 16px; font-size: 13px; color: #b45309; line-height: 1.5;" class="break-word">
                      <strong>Recomendación de seguridad:</strong> Por motivos de seguridad, te sugerimos actualizar tu contraseña una vez hayas ingresado por primera vez a la plataforma.
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center;" class="break-word">
                <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                  Este es un mensaje generado automáticamente, por favor no responda a este correo.<br>
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

export function notificationDescansoMedicoIncorrecto(
  data: INotificationDescansoMedicoIncorrectoProps): string {
  const { nombreCompleto, detalle, appUrl } = data;

  // Prioriza la observación del descanso o del canje
  const observacion = detalle?.observacion;

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Observación de Descanso Médico</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f9; padding: 30px 10px;">
      <tr>
        <td align="center">
          
          <!-- Contenedor Principal -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
            
            <!-- Encabezado / Header -->
            <tr>
              <td style="background-color: #1e293b; padding: 28px 32px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 0.5px; text-transform: uppercase;">
                  Notificación de Subsanación
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
                  Gestión de Descansos Médicos y Subsidios
                </p>
              </td>
            </tr>

            <!-- Cuerpo del mensaje -->
            <tr>
              <td style="padding: 32px 32px 20px 32px;">
                <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0; line-height: 1.5;">
                  Estimado(a) <strong>${nombreCompleto}</strong>,
                </p>
                <p style="font-size: 14px; color: #475569; margin: 0 0 20px 0; line-height: 1.6;">
                  Le informamos que la documentación adjuntada a su solicitud de descanso médico presenta <strong style="color: #dc2626;">observaciones o inconsistencias</strong>. Solicitamos su pronta atención para realizar la corrección correspondiente en el sistema.
                </p>

                <!-- Caja de Observación (Alerta) -->
                ${observacion ? `
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 14px 16px;">
                      <span style="font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; display: block; margin-bottom: 4px;">
                        Motivo de la Observación:
                      </span>
                      <span style="font-size: 13px; color: #7f1d1d; line-height: 1.4;">
                        ${observacion}
                      </span>
                    </td>
                  </tr>
                </table>
                `: ''}

                <!-- Tabla resumen de detalles -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; margin-bottom: 28px; background-color: #53575c; border: 1px solid #e2e8f0; border-radius: 6px;">
                  <tr>
                    <td colspan="2" style="padding: 12px 16px; background-color: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; color: #334155;">
                      Detalles del Registro
                    </td>
                  </tr>
                  
                  <!-- Fila 1 (Blanca) -->
                  <tr style="background-color: #ffffff;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 40%;">Tipo de Descanso:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${detalle?.nombre_tipodescansomedico || 'N/A'}</td>
                  </tr>

                  <!-- Fila 2 (Gris suave) -->
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Tipo de Contingencia:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${detalle?.nombre_tipocontingencia || 'N/A'}</td>
                  </tr>

                  <!-- Fila 3 (Blanca) -->
                  <tr style="background-color: #ffffff;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Diagnóstico / CIE10:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${detalle?.nombre_diagnostico || 'N/A'}</td>
                  </tr>

                  <!-- Fila 4 (Gris suave) -->
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Establecimiento Salud:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${detalle?.nombre_establecimiento || 'N/A'}</td>
                  </tr>

                  <!-- Fila 5 (Blanca) -->
                  <tr style="background-color: #ffffff;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Periodo de Descanso:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                      Del ${detalle?.fecha_inicio || 'N/A'} al ${detalle?.fecha_final || 'N/A'}
                    </td>
                  </tr>

                  <!-- Fila 6 (Gris suave) -->
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b;">Días Totales:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600;">${detalle?.total_dias ?? 'N/A'} días</td>
                  </tr>

                </table>

                <!-- Botón Call To Action -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${appUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                        Subsanar Documentación
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; text-align: center;">
                  Si tiene dudas sobre las observaciones registradas, comuníquese con el área correspondiente.
                </p>
              </td>
            </tr>

            <!-- Pie de página / Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">
                  Atentamente,
                </p>
                <p style="font-size: 13px; font-weight: 600; color: #475569; margin: 0 0 12px 0;">
                  Equipo de Trabajo Social y Subsidios
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
                  Este es un correo automático. Por favor no responda a este mensaje.
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

export function notificationCanjeObservado(
  data: INotificationCanjeObservadoProps): string {
  const { nombreCompleto, detalle, appUrl } = data;
  const descanso = detalle?.descansoMedico;

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Observación de Canje</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f9; padding: 30px 10px;">
      <tr>
        <td align="center">
          
          <!-- Contenedor Principal -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
            
            <!-- Encabezado / Header -->
            <tr>
              <td style="background-color: #1e293b; padding: 28px 32px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 0.5px; text-transform: uppercase;">
                  Notificación de Canje Observado
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
                  Gestión de Descansos Médicos y Subsidios
                </p>
              </td>
            </tr>

            <!-- Cuerpo del mensaje -->
            <tr>
              <td style="padding: 32px 32px 20px 32px;">
                <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0; line-height: 1.5;">
                  Estimado(a) <strong>${nombreCompleto}</strong>,
                </p>
                <p style="font-size: 14px; color: #475569; margin: 0 0 20px 0; line-height: 1.6;">
                  Le informamos que el trámite de <strong style="color: #dc2626;">canje de su descanso médico presenta observaciones</strong>. Solicitamos su pronta atención para subsanar los documentos requeridos en el sistema.
                </p>

                <!-- Caja de Observación (Alerta) -->
                ${detalle?.observacion
      ? `
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 14px 16px;">
                      <span style="font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; display: block; margin-bottom: 4px;">
                        Motivo de la Observación del Canje:
                      </span>
                      <span style="font-size: 13px; color: #7f1d1d; line-height: 1.4;">
                        ${detalle.observacion}
                      </span>
                    </td>
                  </tr>
                </table>
                `
      : ''
    }

                <!-- Tabla Resumen de Detalles con Estilo Claro y Filas Alternadas -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; margin-bottom: 28px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                  
                  <!-- Sección 1: Datos del Canje -->
                  <tr>
                    <td colspan="2" style="padding: 12px 16px; background-color: #f1f5f9; border-bottom: 1px solid #cbd5e1; font-size: 13px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.3px;">
                      Detalles del Subsidio (Canje)
                    </td>
                  </tr>
                  <tr style="background-color: #ffffff;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 40%;">Periodo del Subsidio:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                      Del ${detalle?.fecha_inicio_subsidio || 'N/A'} al ${detalle?.fecha_final_subsidio || 'N/A'}
                    </td>
                  </tr>

                  <!-- Sección 2: Datos del Descanso Médico Asociado -->
                  ${descanso
      ? `
                  <tr>
                    <td colspan="2" style="padding: 12px 16px; background-color: #f1f5f9; border-bottom: 1px solid #cbd5e1; border-top: 1px solid #cbd5e1; font-size: 13px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.3px;">
                      Descanso Médico Asociado
                    </td>
                  </tr>
                  <tr style="background-color: #ffffff;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Tipo de Descanso:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${descanso.nombre_tipodescansomedico || 'N/A'}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Tipo de Contingencia:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${descanso.nombre_tipocontingencia || 'N/A'}</td>
                  </tr>
                  <tr style="background-color: #ffffff;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Diagnóstico / CIE10:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${descanso.nombre_diagnostico || 'N/A'}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Establecimiento Salud:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${descanso.nombre_establecimiento || 'N/A'}</td>
                  </tr>
                  <tr style="background-color: #ffffff;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Periodo de Descanso:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                      Del ${descanso.fecha_inicio || 'N/A'} al ${descanso.fecha_final || 'N/A'}
                    </td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 10px 16px; font-size: 13px; color: #64748b;">Días Totales:</td>
                    <td style="padding: 10px 16px; font-size: 13px; color: #1e293b; font-weight: 600;">${descanso.total_dias ?? 'N/A'} días</td>
                  </tr>
                  `
      : ''
    }
                </table>

                <!-- Botón Call To Action -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${appUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                        Subsanar Canje
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; text-align: center;">
                  Si tiene dudas sobre las observaciones registradas, comuníquese con el área de Trabajo Social.
                </p>
              </td>
            </tr>

            <!-- Pie de página / Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">
                  Atentamente,
                </p>
                <p style="font-size: 13px; font-weight: 600; color: #475569; margin: 0 0 12px 0;">
                  Equipo de Trabajo Social y Subsidios
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
                  Este es un correo automático. Por favor no responda a este mensaje.
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

export function notificationReembolsoObservado(
  data: INotificationReembolsoObservadoProps): string {
  const { nombreCompleto, detalle, appUrl } = data;
  const canje = detalle?.canje;

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Observación de Canje</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f9; padding: 30px 10px;">
      <tr>
        <td align="center">
          
          <!-- Contenedor Principal -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
            
            <!-- Encabezado / Header -->
            <tr>
              <td style="background-color: #1e293b; padding: 28px 32px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 0.5px; text-transform: uppercase;">
                  Notificación de Canje Observado
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
                  Gestión de Descansos Médicos y Subsidios
                </p>
              </td>
            </tr>

            <!-- Cuerpo del mensaje -->
            <tr>
              <td style="padding: 32px 32px 20px 32px;">
                <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0; line-height: 1.5;">
                  Estimado(a) <strong>${nombreCompleto}</strong>,
                </p>
                <p style="font-size: 14px; color: #475569; margin: 0 0 20px 0; line-height: 1.6;">
                  Le informamos que el trámite de <strong style="color: #dc2626;">canje de su descanso médico presenta observaciones</strong>. Solicitamos su pronta atención para subsanar los documentos requeridos en el sistema.
                </p>

                <!-- Caja de Observación (Alerta) -->
                ${detalle?.observacion ? `
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 14px 16px;">
                      <span style="font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; display: block; margin-bottom: 4px;">
                        Motivo de la Observación del Canje:
                      </span>
                      <span style="font-size: 13px; color: #7f1d1d; line-height: 1.4;">
                        ${detalle.observacion}
                      </span>
                    </td>
                  </tr>
                </table>
                ` : ''}

                <!-- Botón Call To Action -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${appUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                        Subsanar Canje
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; text-align: center;">
                  Si tiene dudas sobre las observaciones registradas, comuníquese con el área de Trabajo Social.
                </p>
              </td>
            </tr>

            <!-- Pie de página / Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">
                  Atentamente,
                </p>
                <p style="font-size: 13px; font-weight: 600; color: #475569; margin: 0 0 12px 0;">
                  Equipo de Trabajo Social y Subsidios
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
                  Este es un correo automático. Por favor no responda a este mensaje.
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
  const { nombreCompleto, appUrl } = data;

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Registro de Descanso Médico</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f9; padding: 30px 10px;">
      <tr>
        <td align="center">
          
          <!-- Contenedor Principal -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
            
            <!-- Encabezado / Header -->
            <tr>
              <td style="background-color: #1e293b; padding: 28px 32px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 0.5px; text-transform: uppercase;">
                  Registro de Descanso Médico
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
                  Gestión de Descansos Médicos y Subsidios
                </p>
              </td>
            </tr>

            <!-- Cuerpo del mensaje -->
            <tr>
              <td style="padding: 32px 32px 20px 32px;">
                <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0; line-height: 1.5;">
                  Estimado(a) <strong>${nombreCompleto}</strong>,
                </p>
                <p style="font-size: 14px; color: #475569; margin: 0 0 20px 0; line-height: 1.6;">
                  Confirmamos la recepción de la documentación de su descanso médico. Nuestro equipo la revisará y le notificará la respuesta a la brevedad.
                </p>

                <!-- Tarjeta / Mensaje Informativo -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <span style="font-size: 12px; font-weight: 700; color: #0284c7; text-transform: uppercase; display: block; margin-bottom: 4px;">
                        Estado de la solicitud:
                      </span>
                      <span style="font-size: 13px; color: #334155; line-height: 1.5; display: block;">
                        <strong>En Revisión</strong> — Evaluaremos los documentos presentados en los próximos días hábiles.
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Botón Call To Action -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <a href="${appUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">
                        Acceder a la plataforma
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; text-align: center;">
                  Si necesita adjuntar documentos adicionales o consultar el estado de su trámite, puede hacerlo desde la plataforma.
                </p>
              </td>
            </tr>

            <!-- Pie de página / Footer -->
            <tr>
              <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0 0 4px 0;">
                  Atentamente,
                </p>
                <p style="font-size: 13px; font-weight: 600; color: #475569; margin: 0 0 12px 0;">
                  Equipo de Trabajo Social y Subsidios
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
                  Este es un correo automático. Por favor no responda a este mensaje.
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