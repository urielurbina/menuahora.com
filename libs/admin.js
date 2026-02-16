// Lista de emails con acceso de administrador
export const ADMIN_EMAILS = [
  'soyurielurbina@gmail.com',
  // Agrega más emails de admin aquí
];

export function isAdmin(email) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
