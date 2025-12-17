import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

/**
 * Gerar secret TOTP para 2FA
 */
export function generateTOTPSecret(userEmail: string, appName: string = 'DIGI Hub') {
  const secret = speakeasy.generateSecret({
    name: `${appName} (${userEmail})`,
    issuer: appName,
    length: 32,
  })

  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url || '',
  }
}

/**
 * Gerar QR Code para 2FA
 */
export async function generateQRCode(otpauthUrl: string): Promise<string> {
  try {
    const qrCode = await QRCode.toDataURL(otpauthUrl)
    return qrCode
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Verificar token TOTP
 */
export function verifyTOTPToken(secret: string, token: string, window: number = 2): boolean {
  try {
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window,
    })

    return isValid
  } catch (error) {
    console.error('Error verifying TOTP token:', error)
    return false
  }
}

/**
 * Gerar backup codes para 2FA
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

/**
 * Validar backup code
 */
export function validateBackupCode(code: string, backupCodes: string[]): boolean {
  return backupCodes.includes(code.toUpperCase())
}
