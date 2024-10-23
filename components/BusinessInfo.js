'use client';

import { useState } from 'react';

export default function BusinessInfo({ basicInfo, appearance = {} }) {
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  const formatSchedule = (schedule) => {
    if (!schedule || !schedule.enabled) return 'Horario no disponible';

    const today = new Date().getDay();
    const todayName = daysOfWeek[today];
    const todaySchedule = schedule.days[todayName];

    if (!todaySchedule || todaySchedule.isClosed) return 'Cerrado hoy';

    return `Hoy: ${todaySchedule.open} - ${todaySchedule.close}`;
  };

  const secondaryColor = appearance.secondaryColor || '#FFFFFF'; // Color por defecto si no está definido
  const titleFont = appearance.titleFont || 'sans-serif';
  const bodyFont = appearance.bodyFont || 'sans-serif';

  return (
    <div className="px-6 py-4" style={{color: secondaryColor, fontFamily: bodyFont}}>
      <h1 className="text-2xl font-bold tracking-tight" style={{fontFamily: titleFont}}>{basicInfo.businessName}</h1>
      <p className="text-sm mt-1">{basicInfo.slogan}</p>
      <div className="mt-4">
        <p className="text-sm font-bold">Dirección:</p>
        <p className="text-sm">{basicInfo.contact?.address || 'Dirección no disponible'}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-bold">Horario:</p>
        <p className="text-sm">{formatSchedule(basicInfo.schedule)}</p>
        <button 
          className="text-sm underline mt-1"
          onClick={() => setShowFullSchedule(!showFullSchedule)}
        >
          {showFullSchedule ? 'Ocultar horario completo' : 'Ver horario completo'}
        </button>
        {showFullSchedule && basicInfo.schedule && basicInfo.schedule.enabled && (
          <div className="mt-2">
            {daysOfWeek.map(day => (
              <p key={day} className="text-sm">
                {day.charAt(0).toUpperCase() + day.slice(1)}: {' '}
                {basicInfo.schedule.days[day]?.isClosed 
                  ? 'Cerrado'
                  : `${basicInfo.schedule.days[day]?.open || 'N/A'} - ${basicInfo.schedule.days[day]?.close || 'N/A'}`
                }
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm">{basicInfo.description}</p>
      </div>
    </div>
  );
}
