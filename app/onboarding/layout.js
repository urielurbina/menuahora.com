export const metadata = {
  title: 'Configura tu negocio | MenúAhora',
  description: 'Configura tu menú digital en minutos',
};

export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </div>
  );
}
