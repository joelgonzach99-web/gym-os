import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const FRASES = [
  { text: "El dolor de hoy es la fuerza de mañana.", src: "— Arnold Schwarzenegger" },
  { text: "No pares cuando estés cansado. Pará cuando hayas terminado.", src: "— David Goggins" },
  { text: "Tu cuerpo puede hacerlo. Es tu mente la que tenés que convencer.", src: "— GYM OS" },
  { text: "Cada rep te acerca más a quien querés ser.", src: "— GYM OS" },
  { text: "Disciplina es elegir lo que querés más sobre lo que querés ahora.", src: "— GYM OS" },
  { text: "148g de proteína. Cada día. Sin excusas.", src: "— Plan Bulk 2026" },
  { text: "Tu grasa actual ya es historia. Construí lo que sigue.", src: "— GYM OS" },
  { text: "Seis meses de disciplina o toda tu vida deseando haber empezado.", src: "— GYM OS" },
  { text: "Los records se rompen una sola vez. Hasta que los rompés de nuevo.", src: "— GYM OS" },
  { text: "El músculo se construye en el plato y se prueba en el gym.", src: "— GYM OS" },
]

const FRASES_MOTIVACION = [
  { text: "El éxito no es final, el fracaso no es fatal: es el coraje de continuar lo que cuenta.", src: "— Winston Churchill" },
  { text: "Somos lo que hacemos repetidamente. La excelencia no es un acto sino un hábito.", src: "— Aristóteles" },
  { text: "No cuentes los días. Hacé que los días cuenten.", src: "— Muhammad Ali" },
  { text: "El único mal entrenamiento es el que no hiciste.", src: "— GYM OS" },
  { text: "Pequeño progreso cada día suma a grandes resultados.", src: "— Satya Nani" },
  { text: "La disciplina es el puente entre metas y logros.", src: "— Jim Rohn" },
]

const DATOS_BULK = [
  { titulo: "SÍNTESIS PROTEICA", dato: "El músculo se repara 24-48h post-entreno. La proteína importa incluso en días de descanso.", fuente: "Sports Medicine Journal" },
  { titulo: "CREATINA + BULK", dato: "5g diarios de creatina aumenta la fuerza en 5-15% y el volumen muscular por retención intracelular.", fuente: "Int. Journal of Sport Nutrition" },
  { titulo: "SUEÑO = MÚSCULO", dato: "El 70% de la hormona de crecimiento (HGH) se libera en sueño profundo. Dormir mal = bulk lento.", fuente: "Journal of Clinical Endocrinology" },
  { titulo: "PROGRESSIVE OVERLOAD", dato: "Agregar peso, reps o sets cada semana es el único principio garantizado en hipertrofia.", fuente: "Schoenfeld 2010" },
  { titulo: "HIDRATACIÓN Y FUERZA", dato: "Con 2% de deshidratación la fuerza muscular cae hasta un 20%. 3L diarios no es opcional.", fuente: "Journal of Athletic Training" },
  { titulo: "PROTEÍNA ÓPTIMA", dato: "1.6-2.2g por kg de peso corporal maximiza la síntesis proteica. Para vos: ~148g/día.", fuente: "Morton et al. 2018" },
]

const SUPLEMENTOS_LIST = [
  { id: 'creatina',   nombre: 'Creatina',   dosis: '5g',     emoji: '⚡', color: '#e8ff3c', timing: 'Cualquier hora, con agua' },
  { id: 'proteina',   nombre: 'Proteína',   dosis: '30g',    emoji: '💪', color: '#3cffb4', timing: 'Post-entreno' },
  { id: 'vitamina_c', nombre: 'Vitamina C', dosis: '1000mg', emoji: '🍊', color: '#ff9f3c', timing: 'Con comida' },
  { id: 'omega3',     nombre: 'Omega 3',    dosis: '2 caps', emoji: '🐟', color: '#3c9fff', timing: 'Con comidas' },
  { id: 'vitamina_d', nombre: 'Vitamina D', dosis: '2000IU', emoji: '☀️', color: '#ffd93c', timing: 'Con comida grasa' },
  { id: 'magnesio',   nombre: 'Magnesio',   dosis: '400mg',  emoji: '🌙', color: '#c47fff', timing: 'Antes de dormir' },
]

// ─── SILUETAS SVG ─────────────────────────────────────────────────────────────
const ExerciseFigure = ({ type, color = '#e8ff3c' }) => {
  const f = {
    bench_press: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <rect x="4" y="28" width="48" height="5" rx="2" fill={color} opacity="0.3"/>
      <rect x="6" y="33" width="4" height="8" rx="1" fill={color} opacity="0.2"/>
      <rect x="46" y="33" width="4" height="8" rx="1" fill={color} opacity="0.2"/>
      <circle cx="28" cy="20" r="4" fill={color} opacity="0.5"/>
      <ellipse cx="28" cy="26" rx="10" ry="4" fill={color} opacity="0.15"/>
      <line x1="16" y1="24" x2="12" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="24" x2="44" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="8" y1="14" x2="48" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="8" cy="14" r="3.5" fill={color} opacity="0.6"/>
      <circle cx="48" cy="14" r="3.5" fill={color} opacity="0.6"/>
    </svg>,
    incline_press: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <rect x="4" y="22" width="40" height="5" rx="2" transform="rotate(-20 4 22)" fill={color} opacity="0.3"/>
      <circle cx="22" cy="16" r="4" fill={color} opacity="0.5"/>
      <line x1="14" y1="20" x2="10" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="18" x2="34" y2="9" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="6" y1="10" x2="38" y2="9" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="6" cy="10" r="3" fill={color} opacity="0.6"/>
      <circle cx="38" cy="9" r="3" fill={color} opacity="0.6"/>
    </svg>,
    flyes: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <rect x="16" y="26" width="24" height="4" rx="2" fill={color} opacity="0.3"/>
      <circle cx="28" cy="20" r="4" fill={color} opacity="0.5"/>
      <line x1="21" y1="22" x2="6" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="35" y1="22" x2="50" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="6" cy="18" r="3" fill={color} opacity="0.5"/>
      <circle cx="50" cy="18" r="3" fill={color} opacity="0.5"/>
    </svg>,
    dips: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <line x1="10" y1="14" x2="10" y2="40" stroke={color} strokeWidth="2" opacity="0.3"/>
      <line x1="46" y1="14" x2="46" y2="40" stroke={color} strokeWidth="2" opacity="0.3"/>
      <line x1="6" y1="14" x2="50" y2="14" stroke={color} strokeWidth="2" opacity="0.3"/>
      <circle cx="28" cy="10" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="14" x2="28" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="14" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="42" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="22" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="34" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    tricep_ext: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="8" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="12" x2="28" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="16" x2="20" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="20" y1="10" x2="20" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
      <line x1="28" y1="16" x2="36" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="10" x2="36" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
      <line x1="28" y1="24" x2="22" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="24" x2="34" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="16" y1="22" x2="40" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    pullup: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <line x1="4" y1="6" x2="52" y2="6" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      <circle cx="28" cy="14" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="18" x2="18" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="38" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="28" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="30" x2="22" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="30" x2="34" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    row: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="12" cy="16" r="4" fill={color} opacity="0.5"/>
      <line x1="12" y1="20" x2="16" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="12" y1="20" x2="36" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="28" x2="48" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="48" cy="22" r="3" fill={color} opacity="0.5"/>
      <line x1="16" y1="30" x2="14" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="16" y1="30" x2="22" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    curl: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="8" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="12" x2="28" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M28 18 Q16 18 14 26" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="13" cy="28" r="3" fill={color} opacity="0.5"/>
      <path d="M28 18 Q40 18 42 26" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="43" cy="28" r="3" fill={color} opacity="0.5"/>
      <line x1="28" y1="26" x2="22" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="34" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    squat: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="8" r="4" fill={color} opacity="0.5"/>
      <line x1="8" y1="14" x2="48" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      <circle cx="8" cy="14" r="3" fill={color} opacity="0.5"/>
      <circle cx="48" cy="14" r="3" fill={color} opacity="0.5"/>
      <line x1="28" y1="14" x2="28" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="22" x2="16" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="22" x2="40" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="16" y1="32" x2="12" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="32" x2="44" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    leg_press: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <rect x="6" y="28" width="20" height="12" rx="3" fill={color} opacity="0.2"/>
      <circle cx="16" cy="20" r="4" fill={color} opacity="0.5"/>
      <line x1="16" y1="24" x2="8" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="8" y1="18" x2="8" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="24" x2="24" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="18" x2="28" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="32" y="8" width="18" height="4" rx="2" fill={color} opacity="0.4"/>
    </svg>,
    hip_thrust: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <rect x="4" y="28" width="20" height="6" rx="3" fill={color} opacity="0.3"/>
      <circle cx="36" cy="14" r="4" fill={color} opacity="0.5"/>
      <line x1="36" y1="18" x2="30" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="24" x2="20" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="30" y1="24" x2="40" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="20" y1="28" x2="18" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="28" x2="42" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="16" y1="24" x2="48" y2="24" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      <circle cx="16" cy="24" r="3" fill={color} opacity="0.5"/>
      <circle cx="48" cy="24" r="3" fill={color} opacity="0.5"/>
    </svg>,
    deadlift: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="6" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="10" x2="28" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="16" x2="18" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="16" x2="38" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="20" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="36" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="6" y1="36" x2="50" y2="36" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      <circle cx="6" cy="36" r="4" fill={color} opacity="0.5"/>
      <circle cx="50" cy="36" r="4" fill={color} opacity="0.5"/>
    </svg>,
    shoulder_press: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="10" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="14" x2="28" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="28" x2="20" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="28" x2="36" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="14" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="22" x2="10" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="42" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="42" y1="22" x2="46" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="10" x2="50" y2="10" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      <circle cx="6" cy="10" r="3" fill={color} opacity="0.5"/>
      <circle cx="50" cy="10" r="3" fill={color} opacity="0.5"/>
    </svg>,
    lateral_raise: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="10" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="14" x2="28" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="28" x2="20" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="28" x2="36" y2="38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="6" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="6" cy="18" r="3" fill={color} opacity="0.6"/>
      <line x1="28" y1="18" x2="50" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="50" cy="18" r="3" fill={color} opacity="0.6"/>
    </svg>,
    plank: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="10" cy="22" r="4" fill={color} opacity="0.5"/>
      <line x1="10" y1="26" x2="46" y2="26" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      <line x1="14" y1="26" x2="14" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="34" x2="10" y2="34" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="26" x2="24" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="34" x2="20" y2="34" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="46" y1="26" x2="48" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="42" y1="26" x2="44" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    rdl: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="8" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="12" x2="10" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="20" x2="46" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="20" x2="30" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="26" x2="10" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="36" x2="32" y2="36" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
      <circle cx="6" cy="36" r="3" fill={color} opacity="0.5"/>
      <circle cx="32" cy="36" r="3" fill={color} opacity="0.5"/>
    </svg>,
    lunge: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="8" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="12" x2="28" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="20" y2="20" stroke={color} strokeWidth="2" opacity="0.4"/>
      <line x1="28" y1="18" x2="36" y2="20" stroke={color} strokeWidth="2" opacity="0.4"/>
      <line x1="28" y1="22" x2="18" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="18" y1="30" x2="14" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="22" x2="40" y2="28" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="28" x2="44" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>,
    calf_raise: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="6" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="10" x2="28" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="18" x2="18" y2="20" stroke={color} strokeWidth="2" opacity="0.4"/>
      <line x1="28" y1="18" x2="38" y2="20" stroke={color} strokeWidth="2" opacity="0.4"/>
      <line x1="28" y1="26" x2="22" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="26" x2="34" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="34" x2="20" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="19" cy="42" rx="4" ry="2" fill={color} opacity="0.4"/>
      <line x1="34" y1="34" x2="36" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="37" cy="42" rx="4" ry="2" fill={color} opacity="0.4"/>
    </svg>,
    face_pull: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="14" cy="18" r="4" fill={color} opacity="0.5"/>
      <line x1="14" y1="22" x2="14" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="34" x2="8" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="34" x2="20" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="24" x2="6" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="14" y1="24" x2="22" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M6 18 Q28 14 50 16" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <circle cx="50" cy="16" r="3" fill={color} opacity="0.4"/>
    </svg>,
    walk: <svg width="56" height="44" viewBox="0 0 56 44" fill="none">
      <circle cx="28" cy="6" r="4" fill={color} opacity="0.5"/>
      <line x1="28" y1="10" x2="28" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="16" x2="18" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="16" x2="38" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="24" x2="20" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="24" x2="38" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="20" y1="36" x2="16" y2="44" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="32" x2="42" y2="40" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  }
  return f[type] || f.walk
}

// ─── RUTINAS ──────────────────────────────────────────────────────────────────
const ROUTINES = {
  lunes: {
    title:'PECHO + TRÍCEPS', badge:'PUSH', color:'#e8ff3c',
    splitA:{ name:'Pecho', exercises:['l1','l2','l3','l4'] },
    splitB:{ name:'Tríceps', exercises:['l5','l6','l7','l8'] },
    exercises:[
      { id:'l1', name:'Press de banca plano',        detail:'4 × 8-10 reps · 60-70% 1RM', muscle:'Pecho',           figure:'bench_press' },
      { id:'l2', name:'Press inclinado mancuernas',  detail:'4 × 10-12 reps',              muscle:'Pecho Alto',      figure:'incline_press' },
      { id:'l3', name:'Aperturas en polea baja',     detail:'3 × 12-15 reps',              muscle:'Pecho Medio',     figure:'flyes' },
      { id:'l4', name:'Fondos en paralelas',         detail:'3 × 10-12 reps',              muscle:'Pecho Bajo',      figure:'dips' },
      { id:'l5', name:'Press francés barra EZ',      detail:'3 × 10-12 reps',              muscle:'Tríceps Largo',   figure:'tricep_ext' },
      { id:'l6', name:'Extensiones tríceps polea',   detail:'3 × 12-15 reps',              muscle:'Tríceps Lateral', figure:'tricep_ext' },
      { id:'l7', name:'Aperturas mancuernas planas', detail:'3 × 12 reps',                 muscle:'Pecho Completo',  figure:'flyes' },
      { id:'l8', name:'Pushdown agarre neutro',      detail:'2 × 15 reps · finalizador',   muscle:'Tríceps',         figure:'tricep_ext' },
    ],
  },
  martes: {
    title:'ESPALDA + BÍCEPS', badge:'PULL', color:'#3c9fff',
    splitA:{ name:'Espalda', exercises:['m1','m2','m3','m4','m5'] },
    splitB:{ name:'Bíceps', exercises:['m6','m7','m8'] },
    exercises:[
      { id:'m1', name:'Dominadas lastre o asistidas', detail:'4 × 6-10 reps',             muscle:'Dorsal Ancho',     figure:'pullup' },
      { id:'m2', name:'Remo con barra pronado',       detail:'4 × 8-10 reps',             muscle:'Dorsal/Romboides', figure:'row' },
      { id:'m3', name:'Jalón al pecho agarre neutro', detail:'3 × 10-12 reps',            muscle:'Dorsal',           figure:'pullup' },
      { id:'m4', name:'Remo en polea sentado',        detail:'3 × 12 reps',               muscle:'Espalda Media',    figure:'row' },
      { id:'m5', name:'Pullover con mancuerna',       detail:'3 × 12-15 reps',            muscle:'Dorsal/Serrato',   figure:'row' },
      { id:'m6', name:'Curl con barra EZ',            detail:'4 × 8-10 reps',             muscle:'Bíceps',           figure:'curl' },
      { id:'m7', name:'Curl martillo alterno',        detail:'3 × 10-12 reps',            muscle:'Bíceps/Braquial',  figure:'curl' },
      { id:'m8', name:'Curl en polea alta',           detail:'2 × 15 reps · finalizador', muscle:'Bíceps Pico',      figure:'curl' },
    ],
  },
  miercoles: {
    title:'CUÁDRICEPS + GLÚTEOS', badge:'LEGS A', color:'#ff3c3c',
    splitA:{ name:'Cuádriceps', exercises:['x1','x2','x3','x4'] },
    splitB:{ name:'Glúteos/Femoral', exercises:['x5','x6','x7','x8'] },
    exercises:[
      { id:'x1', name:'Sentadilla libre high bar',  detail:'4 × 6-8 reps · pesado',    muscle:'Cuádriceps/Glúteo', figure:'squat' },
      { id:'x2', name:'Prensa de piernas 45°',      detail:'4 × 10-12 reps',           muscle:'Cuádriceps',        figure:'leg_press' },
      { id:'x3', name:'Sentadilla hack',            detail:'3 × 12 reps',              muscle:'Cuádriceps',        figure:'squat' },
      { id:'x4', name:'Extensiones de cuádriceps',  detail:'3 × 15 reps',              muscle:'Cuádriceps Aisla.', figure:'leg_press' },
      { id:'x5', name:'Hip thrust con barra',       detail:'4 × 10-12 reps',           muscle:'Glúteo Mayor',      figure:'hip_thrust' },
      { id:'x6', name:'Curl femoral acostado',      detail:'3 × 12 reps',              muscle:'Femoral',           figure:'rdl' },
      { id:'x7', name:'Pantorrillas de pie',        detail:'5 × 15-20 reps',           muscle:'Gemelos',           figure:'calf_raise' },
      { id:'x8', name:'Abductores en máquina',      detail:'3 × 15-20 reps',           muscle:'Glúteo Medio',      figure:'hip_thrust' },
    ],
  },
  jueves: {
    title:'HOMBROS + CORE', badge:'DELTS', color:'#d4a843',
    splitA:{ name:'Hombros', exercises:['j1','j2','j3','j4','j5','j6'] },
    splitB:{ name:'Core', exercises:['j7','j8'] },
    exercises:[
      { id:'j1', name:'Press militar con barra',      detail:'4 × 6-8 reps',           muscle:'Deltoides Front.',  figure:'shoulder_press' },
      { id:'j2', name:'Press Arnold mancuernas',      detail:'3 × 10-12 reps',         muscle:'Deltoides 360°',   figure:'shoulder_press' },
      { id:'j3', name:'Elevaciones laterales cable',  detail:'4 × 15 reps · estricto', muscle:'Deltoides Medio',   figure:'lateral_raise' },
      { id:'j4', name:'Face pulls polea alta',        detail:'4 × 15-20 reps',         muscle:'Deltoides Post.',   figure:'face_pull' },
      { id:'j5', name:'Elevaciones frontales disco',  detail:'3 × 12 reps',            muscle:'Deltoides Front.',  figure:'lateral_raise' },
      { id:'j6', name:'Encogimientos de hombros',     detail:'3 × 12-15 reps',         muscle:'Trapecios',         figure:'shoulder_press' },
      { id:'j7', name:'Plancha frontal',              detail:'3 × 45-60 seg',          muscle:'Core',              figure:'plank' },
      { id:'j8', name:'Plancha lateral',              detail:'3 × 30-45 seg c/lado',   muscle:'Oblicuos',          figure:'plank' },
    ],
  },
  viernes: {
    title:'ISQUIOS + ESPALDA BAJA', badge:'PULL 2', color:'#3cffb4',
    splitA:{ name:'Femoral/Lumbar', exercises:['v1','v2','v3','v4','v5'] },
    splitB:{ name:'Pierna Compl.', exercises:['v6','v7','v8'] },
    exercises:[
      { id:'v1', name:'Peso muerto convencional', detail:'5 × 4-6 reps · 80-85% 1RM', muscle:'Cadena Posterior', figure:'deadlift' },
      { id:'v2', name:'Peso muerto rumano',       detail:'3 × 10-12 reps',             muscle:'Femoral/Glúteo',  figure:'rdl' },
      { id:'v3', name:'Buenos días con barra',    detail:'3 × 10-12 reps',             muscle:'Lumbar/Femoral',  figure:'rdl' },
      { id:'v4', name:'Curl femoral sentado',     detail:'4 × 10-12 reps',             muscle:'Femoral Aislado', figure:'rdl' },
      { id:'v5', name:'Hiperextensiones',         detail:'3 × 15 reps',                muscle:'Lumbar',          figure:'rdl' },
      { id:'v6', name:'Zancadas caminando',       detail:'3 × 12 reps c/lado',         muscle:'Cuádriceps/Glút', figure:'lunge' },
      { id:'v7', name:'Sentadilla búlgara',       detail:'3 × 10 reps c/lado',         muscle:'Cuádriceps',      figure:'lunge' },
      { id:'v8', name:'Abdominal en polea',       detail:'3 × 15-20 reps',             muscle:'Core',            figure:'plank' },
    ],
  },
  sabado: {
    title:'PECHO VOL. + BRAZOS', badge:'PUSH 2', color:'#c47fff',
    splitA:{ name:'Pecho/Hombros', exercises:['s1','s2','s3','s4'] },
    splitB:{ name:'Bíceps/Tríceps', exercises:['s5','s6','s7','s8'] },
    exercises:[
      { id:'s1', name:'Press inclinado barra',             detail:'4 × 8-10 reps',       muscle:'Pecho Alto',      figure:'incline_press' },
      { id:'s2', name:'Aperturas mancuernas plano',        detail:'3 × 12 reps',         muscle:'Pecho Medio',     figure:'flyes' },
      { id:'s3', name:'Cruces en polea',                   detail:'3 × 15 reps',         muscle:'Pecho/Contrac.',  figure:'flyes' },
      { id:'s4', name:'Elevaciones laterales mancuerna',  detail:'5 × 15 reps · 45s',   muscle:'Deltoides Medio', figure:'lateral_raise' },
      { id:'s5', name:'Curl bíceps concentrado',          detail:'4 × 10-12 reps',       muscle:'Bíceps Pico',     figure:'curl' },
      { id:'s6', name:'Press cerrado barra',              detail:'3 × 8-10 reps',        muscle:'Tríceps',         figure:'bench_press' },
      { id:'s7', name:'Curl 21s',                         detail:'3 × 21 reps (7+7+7)', muscle:'Bíceps Completo', figure:'curl' },
      { id:'s8', name:'Kickbacks tríceps cable',          detail:'3 × 15 reps',          muscle:'Tríceps Lateral', figure:'tricep_ext' },
    ],
  },
  domingo: {
    title:'RECUPERACIÓN ACTIVA', badge:'REST', color:'#555',
    splitA:{ name:'Todo', exercises:['d1','d2','d3','d4'] },
    splitB:null,
    exercises:[
      { id:'d1', name:'Caminata 30-45 minutos',    detail:'Ritmo moderado', muscle:'Cardio Suave', figure:'walk' },
      { id:'d2', name:'Stretching full body',      detail:'15-20 minutos',  muscle:'Movilidad',    figure:'plank' },
      { id:'d3', name:'Foam rolling',              detail:'10 minutos',     muscle:'Recuperación', figure:'plank' },
      { id:'d4', name:'Visualización y meal prep', detail:'Planificar',     muscle:'Mental',       figure:'walk' },
    ],
  },
}

const DAYS    = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
const DAYS_ES = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
const DAYS_S  = ['L','M','X','J','V','S','D']

const s = {
  bg:'#080808',surf:'#101010',surf2:'#141414',surf3:'#1a1a1a',
  border:'#1e1e1e',border2:'#282828',
  text:'#f0f0f0',muted:'#444',muted2:'#666',
  accent:'#e8ff3c',green:'#3cffb4',red:'#ff3c3c',
  blue:'#3c9fff',gold:'#d4a843',purple:'#c47fff',orange:'#ff9f3c',
}
const C = {
  sidebar:{ position:'fixed',left:0,top:0,bottom:0,width:230,background:s.surf,borderRight:`1px solid ${s.border}`,display:'flex',flexDirection:'column',zIndex:100,fontFamily:'system-ui,sans-serif',overflowY:'auto' },
  main:{ marginLeft:230,padding:'32px 40px',minHeight:'100vh',fontFamily:'system-ui,sans-serif',background:s.bg,color:s.text,width:'calc(100vw - 230px)',maxWidth:'calc(100vw - 230px)',overflowX:'hidden' },
  navItem:(a)=>({ display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:500,color:a?s.accent:'#666',background:a?'rgba(232,255,60,.08)':'transparent',border:a?`1px solid rgba(232,255,60,.12)`:'1px solid transparent',marginBottom:2,transition:'all .15s' }),
  card:{ background:s.surf,border:`1px solid ${s.border}`,borderRadius:12,padding:20 },
  inp:{ background:s.surf2,border:`1px solid ${s.border}`,borderRadius:8,padding:'9px 12px',color:s.text,fontFamily:'system-ui,sans-serif',fontSize:13,outline:'none',width:'100%' },
  btn:{ fontWeight:700,padding:'9px 16px',borderRadius:8,border:'none',cursor:'pointer',fontSize:13,transition:'all .15s' },
}

export default function App() {
  const [page,setPage]=useState('dashboard')
  const todayIdx=new Date().getDay()===0?6:new Date().getDay()-1
  const [currentDay,setCurrentDay]=useState(DAYS[todayIdx])
  const [splitMode,setSplitMode]=useState({})
  const [checks,setChecks]=useState({})
  const [weights,setWeights]=useState({})
  const [foods,setFoods]=useState([])
  const [medidas,setMedidas]=useState([])
  const [aguaL,setAguaL]=useState(0)
  const [aguaWeek,setAguaWeek]=useState({})
  const [suplementos,setSuplementos]=useState({})
  const [suplWeek,setSuplWeek]=useState({})
  const [gymWeek,setGymWeek]=useState({})
  const [asistencia,setAsistencia]=useState([])
  const [foodForm,setFoodForm]=useState({nombre:'',cals:'',proteina:'',carbos:'',grasas:''})
  const [medForm,setMedForm]=useState({peso:'',musculo:'',grasa_kg:'',grasa_pct:'',cintura:'',bicep:'',inbody:'',notas:''})
  const [toast,setToast]=useState('')
  const [fraseIdx,setFraseIdx]=useState(0)
  const [motivIdx,setMotivIdx]=useState(0)
  const [aiLoading,setAiLoading]=useState(false)
  const [aiResult,setAiResult]=useState(null)
  const fileRef=useRef()

  const today=new Date().toDateString()
  const todayISO=new Date().toISOString().split('T')[0]
  const fechaHoy=new Date().toLocaleDateString('es-ES')

  useEffect(()=>{ const id=setInterval(()=>setFraseIdx(i=>(i+1)%FRASES.length),15000); return()=>clearInterval(id) },[])
  useEffect(()=>{ loadAll() },[])

  function getWeekDates(){ const dates=[],now=new Date(),dow=now.getDay()===0?6:now.getDay()-1; for(let i=0;i<7;i++){const d=new Date(now);d.setDate(now.getDate()-dow+i);dates.push(d.toISOString().split('T')[0])} return dates }
  function getWeekStart(){ const d=new Date(),dow=d.getDay()===0?6:d.getDay()-1; d.setDate(d.getDate()-dow); return d.toISOString().split('T')[0] }
  const weekDates=getWeekDates()

  async function loadAll(){
    const [c,f,m,a,sup,asist,w,gw]=await Promise.all([
      supabase.from('gym_checks').select('*').eq('fecha',today),
      supabase.from('gym_foods').select('*').eq('fecha',today),
      supabase.from('gym_medidas').select('*').order('created_at',{ascending:false}),
      supabase.from('gym_agua').select('*').gte('fecha',getWeekStart()),
      supabase.from('gym_suplementos').select('*').gte('fecha',getWeekStart()),
      supabase.from('gym_asistencia').select('*').order('created_at',{ascending:false}).limit(60),
      supabase.from('gym_weights').select('*').order('fecha',{ascending:false}).limit(500),
      supabase.from('gym_gymdays').select('*').gte('fecha',getWeekStart()),
    ])
    if(c.data){const ch={};c.data.forEach(x=>ch[x.exercise_id]=x.done);setChecks(ch)}
    if(f.data) setFoods(f.data)
    if(m.data) setMedidas(m.data)
    if(a.data){
      const todayRow=a.data.find(r=>r.fecha===todayISO)
      if(todayRow) setAguaL(+(todayRow.litros||0))
      const aw={};a.data.forEach(r=>{aw[r.fecha]=+(r.litros||0)});setAguaWeek(aw)
    }
    if(sup.data){
      const byDate={},todaySups={}
      sup.data.forEach(row=>{SUPLEMENTOS_LIST.forEach(s=>{if(row[s.id]){byDate[`${row.fecha}-${s.id}`]=true;if(row.fecha===todayISO)todaySups[s.id]=true}})})
      setSuplWeek(byDate);setSuplementos(todaySups)
    }
    if(asist.data) setAsistencia(asist.data)
    if(w.data){
      const wmap={}
      w.data.forEach(r=>{if(!wmap[r.exercise_id])wmap[r.exercise_id]={};wmap[r.exercise_id][r.fecha]=r.lbs})
      setWeights(wmap)
    }
    if(gw.data){const gmap={};gw.data.forEach(r=>{gmap[r.fecha]=true});setGymWeek(gmap)}
  }

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),2800)}

  async function addAgua(delta){
    const nuevo=Math.max(0,Math.min(6,+(aguaL+delta).toFixed(2)))
    setAguaL(nuevo);setAguaWeek(prev=>({...prev,[todayISO]:nuevo}))
    const ex=await supabase.from('gym_agua').select('id').eq('fecha',todayISO).single()
    if(ex.data) await supabase.from('gym_agua').update({litros:nuevo}).eq('id',ex.data.id)
    else await supabase.from('gym_agua').insert({fecha:todayISO,litros:nuevo})
    if(nuevo>=3) showToast('🏆 ¡Meta de agua alcanzada!')
  }

  async function toggleSuplemento(id){
    const nuevo={...suplementos,[id]:!suplementos[id]}
    setSuplementos(nuevo);setSuplWeek(prev=>({...prev,[`${todayISO}-${id}`]:nuevo[id]}))
    const ex=await supabase.from('gym_suplementos').select('id').eq('fecha',todayISO).single()
    if(ex.data) await supabase.from('gym_suplementos').update({[id]:nuevo[id]}).eq('id',ex.data.id)
    else await supabase.from('gym_suplementos').insert({fecha:todayISO,[id]:nuevo[id]})
    if(nuevo[id]) showToast('✅ '+SUPLEMENTOS_LIST.find(s=>s.id===id)?.nombre+' tomado!')
  }

  async function toggleGymDay(fecha){
    const current=gymWeek[fecha];setGymWeek(prev=>({...prev,[fecha]:!current}))
    if(!current){await supabase.from('gym_gymdays').upsert({fecha,fue:true});showToast('🏋️ Día de gym registrado!')}
    else await supabase.from('gym_gymdays').delete().eq('fecha',fecha)
  }

  async function toggleCheck(id){
    const done=!checks[id];setChecks(prev=>({...prev,[id]:done}))
    const ex=await supabase.from('gym_checks').select('id').eq('fecha',today).eq('exercise_id',id).single()
    if(ex.data) await supabase.from('gym_checks').update({done}).eq('id',ex.data.id)
    else await supabase.from('gym_checks').insert({fecha:today,exercise_id:id,done})
  }

  async function saveWeight(exerciseId,lbs){
    const lbsNum=parseFloat(lbs);if(isNaN(lbsNum)||lbsNum<=0)return
    const updated={...(weights[exerciseId]||{}),[todayISO]:lbsNum}
    setWeights(prev=>({...prev,[exerciseId]:updated}))
    await supabase.from('gym_weights').upsert({exercise_id:exerciseId,fecha:todayISO,lbs:lbsNum})
    const allVals=Object.values(updated).map(Number).filter(v=>v>0)
    if(lbsNum>=Math.max(...allVals)) showToast('🏅 NUEVO RÉCORD: '+lbsNum+' lbs!')
  }

  function getRecord(exId){
    const entries=weights[exId];if(!entries)return null
    const vals=Object.values(entries).map(Number).filter(v=>v>0)
    return vals.length?Math.max(...vals):null
  }
  function getTodayLbs(exId){return weights[exId]?.[todayISO]||''}

  function getSplitMode(day){return splitMode[day]||'full'}
  function getVisibleExercises(day){
    const r=ROUTINES[day],mode=getSplitMode(day)
    if(mode==='full'||!r.splitB)return r.exercises
    if(mode==='A')return r.exercises.filter(e=>r.splitA.exercises.includes(e.id))
    if(mode==='B')return r.exercises.filter(e=>r.splitB?.exercises.includes(e.id))
    return r.exercises
  }

  async function addFood(){
    if(!foodForm.nombre)return
    const f={...foodForm,fecha:today,cals:+foodForm.cals||0,proteina:+foodForm.proteina||0,carbos:+foodForm.carbos||0,grasas:+foodForm.grasas||0}
    const {data}=await supabase.from('gym_foods').insert(f).select().single()
    if(data){setFoods(prev=>[...prev,data]);setFoodForm({nombre:'',cals:'',proteina:'',carbos:'',grasas:''});showToast('✅ '+f.nombre+' agregado')}
  }
  async function removeFood(id){await supabase.from('gym_foods').delete().eq('id',id);setFoods(prev=>prev.filter(f=>f.id!==id))}

  async function analyzePhoto(e){
    const file=e.target.files[0];if(!file)return
    setAiLoading(true);setAiResult(null)
    const reader=new FileReader()
    reader.onload=async(ev)=>{
      const base64=ev.target.result.split(',')[1],mediaType=file.type||'image/jpeg'
      try{
        const aiPrompt='Analiza esta foto de comida. Estima valores nutricionales. Responde SOLO JSON sin markdown: {nombre, kcal, proteina, carbohidratos, grasas, descripcion, confianza}'
        const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:mediaType,data:base64}},{type:'text',text:aiPrompt}]})})})
        const data=await resp.json()
        const text=data.content?.map(x=>x.text||'').join('')
        let parsed;try{parsed=JSON.parse(text.replace(/```json|```/g,'').trim())}catch{parsed=null}
        setAiResult(parsed)
      }catch{showToast('❌ Error conectando con IA')}
      setAiLoading(false)
    }
    reader.readAsDataURL(file)
  }

  async function addAiFood(){
    if(!aiResult)return
    const f={nombre:aiResult.nombre,cals:aiResult.kcal||0,proteina:aiResult.proteina||0,carbos:aiResult.carbohidratos||0,grasas:aiResult.grasas||0,fecha:today}
    const {data}=await supabase.from('gym_foods').insert(f).select().single()
    if(data){setFoods(prev=>[...prev,data]);setAiResult(null);showToast('✅ '+f.nombre+' desde foto')}
  }

  async function saveMedida(){
    if(!medForm.peso){showToast('⚠️ Ingresá el peso');return}
    const m={...medForm,fecha:fechaHoy,peso:+medForm.peso,musculo:+medForm.musculo||0,grasa_kg:+medForm.grasa_kg||0,grasa_pct:+medForm.grasa_pct||0,cintura:+medForm.cintura||0,bicep:+medForm.bicep||0,inbody:+medForm.inbody||0}
    const {data}=await supabase.from('gym_medidas').insert(m).select().single()
    if(data){setMedidas(prev=>[data,...prev]);setMedForm({peso:'',musculo:'',grasa_kg:'',grasa_pct:'',cintura:'',bicep:'',inbody:'',notas:''});showToast('💾 Medición guardada')}
  }

  const todayFoods=foods.filter(f=>f.fecha===today)
  const totalCals=todayFoods.reduce((a,f)=>a+(+f.cals||0),0)
  const totalProt=todayFoods.reduce((a,f)=>a+(+f.proteina||0),0)
  const totalCarbs=todayFoods.reduce((a,f)=>a+(+f.carbos||0),0)
  const totalFats=todayFoods.reduce((a,f)=>a+(+f.grasas||0),0)

  const r=ROUTINES[currentDay]
  const visEx=getVisibleExercises(currentDay)
  const doneCnt=visEx.filter(e=>checks[e.id]).length
  const pct=visEx.length>0?Math.round(doneCnt/visEx.length*100):0

  const lastMedida=medidas[0]
  const pesoActual=lastMedida?.peso||73.6
  const musculoActual=lastMedida?.musculo||35.6
  const grasaPct=lastMedida?.grasa_pct||15

  const diasGymTotal=asistencia.filter(a=>a.fue).length
  const supsHoy=SUPLEMENTOS_LIST.filter(s=>suplementos[s.id]).length
  const yaFueHoy=!!gymWeek[todayISO]

  let streak=0
  const sortedAsist=[...asistencia].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha))
  for(let i=0;i<sortedAsist.length;i++){const d=new Date();d.setDate(d.getDate()-i);if(sortedAsist[i]?.fecha===d.toDateString())streak++;else break}

  function aguaStatus(){
    if(aguaL<1)return{label:'DESHIDRATADO',emoji:'😬',color:s.red,bg:'rgba(255,60,60,.06)'}
    if(aguaL<2)return{label:'SUFICIENTE',emoji:'😐',color:s.orange,bg:'rgba(255,159,60,.06)'}
    if(aguaL<3)return{label:'BIEN',emoji:'🧠',color:s.gold,bg:'rgba(212,168,67,.06)'}
    return{label:'ÓPTIMO',emoji:'🏆',color:s.green,bg:'rgba(60,255,180,.06)'}
  }
  const aguaSt=aguaStatus()

  const pages=[['⚡','dashboard','Dashboard'],['🏋️','rutina','Rutina'],['💧','hidratacion','Hidratación'],['💊','suplementos','Suplementos'],['🥗','nutricion','Nutrición'],['📈','progreso','Progreso'],['🔥','motivacion','Motivación'],['📏','medidas','Medidas']]

  return (
    <div style={{display:'flex'}}>
      {/* SIDEBAR */}
      <div style={C.sidebar}>
        <div style={{padding:'20px 18px 14px',borderBottom:`1px solid ${s.border}`}}>
          <div style={{fontSize:11,color:s.muted,letterSpacing:3,textTransform:'uppercase',marginBottom:2}}>FASE ACTUAL</div>
          <div style={{background:'rgba(232,255,60,.15)',border:'1px solid rgba(232,255,60,.3)',borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:700,color:s.accent,letterSpacing:1,display:'inline-flex',marginBottom:8}}>🔥 VOLUMEN</div>
          <div style={{fontSize:20,fontWeight:900,color:s.accent,letterSpacing:2}}>GYM OS</div>
          <div style={{fontSize:10,color:s.muted,letterSpacing:2}}>Joel · Bulk 2026</div>
        </div>
        <div style={{padding:'10px 14px',borderBottom:`1px solid ${s.border}`,display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
          {[['Peso',pesoActual+'kg',s.text],['Grasa',grasaPct+'%',s.gold],['Músculo',musculoActual+'kg',s.green],['Streak',streak+'d 🔥',s.accent]].map(([l,v,c])=>(
            <div key={l} style={{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:6,padding:'7px 10px'}}>
              <div style={{fontSize:8,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:2}}>{l}</div>
              <div style={{fontSize:14,fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{padding:'10px 10px',flex:1,overflowY:'auto'}}>
          {pages.map(([icon,id,label])=>(
            <div key={id} style={C.navItem(page===id)} onClick={()=>setPage(id)}>
              <span style={{fontSize:14,width:20,textAlign:'center'}}>{icon}</span>{label}
            </div>
          ))}
        </div>
        <div style={{padding:'12px 14px',borderTop:`1px solid ${s.border}`,minHeight:56}}>
          <div style={{fontSize:10,color:s.muted,fontStyle:'italic',lineHeight:1.5,textAlign:'center'}}>"{FRASES[fraseIdx].text}"</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={C.main}>

        {/* DASHBOARD */}
        {page==='dashboard'&&(
          <div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Panel General</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>BULK · {new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}</div>
            </div>
            <div style={{background:`linear-gradient(135deg,rgba(232,255,60,.06),rgba(60,255,180,.03))`,border:`1px solid rgba(232,255,60,.15)`,borderRadius:12,padding:'18px 24px',marginBottom:20}}>
              <div style={{fontSize:11,color:s.muted,letterSpacing:3,marginBottom:8}}>💬 FRASE DEL DÍA</div>
              <div style={{fontSize:15,color:s.text,fontStyle:'italic',fontWeight:500,lineHeight:1.5,marginBottom:4}}>"{FRASES[fraseIdx].text}"</div>
              <div style={{fontSize:11,color:s.muted}}>{FRASES[fraseIdx].src}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:20}}>
              {[['Peso',pesoActual+' kg',s.text,30,'→ 78 kg'],['Músculo',musculoActual+' kg',s.green,40,'→ 38 kg'],['Grasa','15%',s.gold,65,'≤ 16%'],['Gym este mes',diasGymTotal+' días',s.accent,Math.min(diasGymTotal/24*100,100),'Meta: 24/mes'],['Streak',streak+' días 🔥',s.purple,Math.min(streak/30*100,100),'Racha actual']].map(([l,v,c,p,m])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:9,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:900,color:c}}>{v}</div>
                  <div style={{fontSize:10,color:s.muted,marginTop:3}}>{m}</div>
                  <div style={{height:4,background:s.border2,borderRadius:2,marginTop:8,overflow:'hidden'}}><div style={{height:'100%',width:p+'%',background:c,borderRadius:2,transition:'width .5s'}}/></div>
                </div>
              ))}
            </div>
            <div style={{...C.card,marginBottom:20}}>
              <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>📅 DÍAS AL GYM ESTA SEMANA</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8}}>
                {weekDates.map((fecha,i)=>{
                  const fue=gymWeek[fecha],isToday=fecha===todayISO
                  return <div key={fecha} onClick={()=>toggleGymDay(fecha)} style={{textAlign:'center',padding:'10px 4px',borderRadius:8,border:`1px solid ${isToday?s.accent:fue?s.green:s.border}`,background:fue?'rgba(60,255,180,.06)':s.surf2,cursor:'pointer',transition:'all .2s'}}>
                    <div style={{fontSize:9,color:isToday?s.accent:s.muted,letterSpacing:1,marginBottom:4}}>{DAYS_S[i]}</div>
                    <div style={{fontSize:18}}>{fue?'✅':'⬜'}</div>
                  </div>
                })}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>
              <div style={C.card}>
                <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>💧 Agua hoy</div>
                <div style={{fontSize:28,fontWeight:900,color:aguaSt.color,marginBottom:4}}>{aguaL.toFixed(1)}L</div>
                <div style={{fontSize:12,fontWeight:700,color:aguaSt.color,marginBottom:8}}>{aguaSt.emoji} {aguaSt.label}</div>
                <div style={{height:6,background:s.border2,borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(aguaL/3*100,100)+'%',background:aguaSt.color,borderRadius:3,transition:'width .3s'}}/></div>
              </div>
              <div style={C.card}>
                <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>💊 Suplementos</div>
                <div style={{fontSize:28,fontWeight:900,color:supsHoy===SUPLEMENTOS_LIST.length?s.green:s.accent,marginBottom:8}}>{supsHoy}/{SUPLEMENTOS_LIST.length}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {SUPLEMENTOS_LIST.map(sup=><div key={sup.id} onClick={()=>toggleSuplemento(sup.id)} style={{fontSize:20,cursor:'pointer',opacity:suplementos[sup.id]?1:0.25,transition:'opacity .2s'}} title={sup.nombre}>{sup.emoji}</div>)}
                </div>
              </div>
              <div style={C.card}>
                <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>🥗 Calorías hoy</div>
                <div style={{fontSize:28,fontWeight:900,color:s.accent}}>{totalCals}<span style={{fontSize:14,color:s.muted}}> kcal</span></div>
                <div style={{fontSize:11,color:s.muted,marginBottom:8}}>Proteína: {totalProt}g / 148g</div>
                <div style={{height:5,background:s.border2,borderRadius:3,overflow:'hidden',marginBottom:4}}><div style={{height:'100%',width:Math.min(totalCals/2850*100,100)+'%',background:s.accent,borderRadius:3}}/></div>
                <div style={{height:4,background:s.border2,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(totalProt/148*100,100)+'%',background:s.blue,borderRadius:2}}/></div>
              </div>
            </div>
          </div>
        )}

        {/* RUTINA */}
        {page==='rutina'&&(
          <div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Rutina Semanal</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>HIPERTROFIA · JEFF NIPPARD STYLE · 8 EJERCICIOS</div>
            </div>
            <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
              {DAYS.map((d,i)=>{
                const rc=ROUTINES[d]
                return <div key={d} onClick={()=>setCurrentDay(d)} style={{padding:'7px 14px',borderRadius:6,cursor:'pointer',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',background:currentDay===d?`${rc.color}18`:s.surf,border:`1px solid ${currentDay===d?rc.color:s.border}`,color:currentDay===d?rc.color:'#666',transition:'all .15s'}}>{DAYS_ES[i]}</div>
              })}
            </div>

            {/* Toggle split */}
            {r.splitB&&(
              <div style={{display:'flex',gap:8,marginBottom:14,alignItems:'center',flexWrap:'wrap'}}>
                <span style={{fontSize:11,color:s.muted,letterSpacing:2}}>HOY HACÉS:</span>
                {['full','A','B'].map(mode=>{
                  const label=mode==='full'?'Completo':mode==='A'?`Solo ${r.splitA.name}`:`Solo ${r.splitB.name}`
                  const active=getSplitMode(currentDay)===mode
                  return <button key={mode} onClick={()=>setSplitMode(prev=>({...prev,[currentDay]:mode}))} style={{...C.btn,background:active?r.color:'transparent',color:active?'#000':s.muted,border:`1px solid ${active?r.color:s.border}`,padding:'6px 14px',fontSize:11,letterSpacing:1}}>{label}</button>
                })}
              </div>
            )}

            <div style={{...C.card,marginBottom:12,background:`linear-gradient(135deg,${r.color}10,transparent)`,border:`1px solid ${r.color}30`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:22,fontWeight:900,textTransform:'uppercase',color:r.color}}>
                    {getSplitMode(currentDay)==='full'?r.title:getSplitMode(currentDay)==='A'?r.splitA.name:r.splitB?.name}
                  </div>
                  <div style={{fontSize:11,color:s.muted,marginTop:3,letterSpacing:2}}>{r.badge} · {visEx.length} ejercicios</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:28,fontWeight:900,color:r.color}}>{pct}%</div>
                  <div style={{fontSize:11,color:s.muted}}>{doneCnt}/{visEx.length}</div>
                </div>
              </div>
              <div style={{height:6,background:s.border2,borderRadius:3,marginTop:12,overflow:'hidden'}}>
                <div style={{height:'100%',width:pct+'%',background:r.color,borderRadius:3,transition:'width .4s'}}/>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {visEx.map((e,i)=>{
                const record=getRecord(e.id)
                const todayLbs=getTodayLbs(e.id)
                const isNewRecord=todayLbs&&record&&Number(todayLbs)>=record
                return (
                  <div key={e.id} style={{...C.card,display:'flex',alignItems:'center',gap:12,padding:'12px 16px',border:`1px solid ${checks[e.id]?s.green:s.border}`,background:checks[e.id]?'rgba(60,255,180,.03)':s.surf,transition:'all .15s'}}>
                    <div style={{fontSize:12,color:s.muted,width:18,textAlign:'center',fontWeight:700}}>{i+1}</div>
                    <div onClick={()=>toggleCheck(e.id)} style={{width:24,height:24,borderRadius:'50%',border:`2px solid ${checks[e.id]?s.green:s.border2}`,background:checks[e.id]?s.green:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer',transition:'all .2s'}}>
                      {checks[e.id]&&<span style={{color:'#000',fontSize:12,fontWeight:900}}>✓</span>}
                    </div>
                    {/* Silueta */}
                    <div style={{flexShrink:0,opacity:checks[e.id]?0.4:1,transition:'opacity .2s'}}>
                      <ExerciseFigure type={e.figure} color={r.color}/>
                    </div>
                    {/* Info */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:checks[e.id]?s.muted:s.text,textDecoration:checks[e.id]?'line-through':'none'}}>{e.name}</div>
                      <div style={{fontSize:11,color:s.muted,marginTop:2}}>{e.detail}</div>
                      <div style={{fontSize:10,color:r.color,marginTop:2,letterSpacing:1}}>💪 {e.muscle}</div>
                    </div>
                    {/* Peso lbs */}
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end',marginBottom:4}}>
                        <input
                          type="number" placeholder="0"
                          defaultValue={todayLbs}
                          onKeyDown={ev=>{if(ev.key==='Enter'){saveWeight(e.id,ev.target.value);ev.target.blur()}}}
                          onBlur={ev=>saveWeight(e.id,ev.target.value)}
                          style={{...C.inp,width:70,textAlign:'center',padding:'5px 8px',fontSize:13,border:`1px solid ${isNewRecord?s.gold:s.border}`}}
                        />
                        <span style={{fontSize:11,color:s.muted,minWidth:22}}>lbs</span>
                      </div>
                      {record?(
                        <div style={{fontSize:10,color:isNewRecord?s.green:s.gold,fontWeight:600}}>
                          {isNewRecord?'🏅 NUEVO RÉCORD!':'🏅 '+record+' lbs'}
                        </div>
                      ):null}
                    </div>
                  </div>
                )
              })}
            </div>

            {pct===100&&(
              <div style={{...C.card,marginTop:16,background:'rgba(60,255,180,.08)',border:`1px solid ${s.green}`,textAlign:'center',padding:24}}>
                <div style={{fontSize:28}}>🎉</div>
                <div style={{fontSize:18,fontWeight:900,color:s.green,marginTop:8}}>ENTRENAMIENTO COMPLETADO</div>
                {!yaFueHoy&&<button onClick={()=>toggleGymDay(todayISO)} style={{...C.btn,background:s.green,color:'#000',marginTop:12,padding:'10px 24px'}}>✅ Marcar día de gym</button>}
              </div>
            )}
          </div>
        )}

        {/* HIDRATACIÓN */}
        {page==='hidratacion'&&(
          <div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Hidratación</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>OBJETIVO: 3 LITROS DIARIOS</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{...C.card,textAlign:'center',padding:36,background:aguaSt.bg,border:`1px solid ${aguaSt.color}30`}}>
                <div style={{fontSize:64,marginBottom:4}}>{aguaSt.emoji}</div>
                <div style={{fontSize:64,fontWeight:900,color:aguaSt.color,lineHeight:1}}>{aguaL.toFixed(1)}</div>
                <div style={{fontSize:14,color:s.muted,marginBottom:8}}>litros hoy / 3.0L</div>
                <div style={{fontSize:24,fontWeight:900,color:aguaSt.color,letterSpacing:2,marginBottom:20}}>{aguaSt.label}</div>
                <div style={{height:12,background:s.border2,borderRadius:6,overflow:'hidden',marginBottom:24}}>
                  <div style={{height:'100%',width:Math.min(aguaL/3*100,100)+'%',background:aguaSt.color,borderRadius:6,transition:'width .4s'}}/>
                </div>
                <div style={{display:'flex',gap:10,justifyContent:'center'}}>
                  <button onClick={()=>addAgua(-0.25)} style={{...C.btn,background:s.surf2,border:`1px solid ${s.border}`,color:s.text,padding:'10px 16px'}}>−250ml</button>
                  <button onClick={()=>addAgua(0.5)} style={{...C.btn,background:aguaSt.color,color:'#000',padding:'10px 16px'}}>+500ml</button>
                  <button onClick={()=>addAgua(0.25)} style={{...C.btn,background:s.surf2,border:`1px solid ${s.border}`,color:s.text,padding:'10px 16px'}}>+250ml</button>
                </div>
              </div>

              <div style={C.card}>
                <div style={{fontSize:11,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:16}}>ESTADOS</div>
                {[
                  [s.red,  '😬','0–1L', 'DESHIDRATADO','Rendimiento comprometido'],
                  [s.orange,'😐','1–2L', 'SUFICIENTE',  'Básico cubierto'],
                  [s.gold, '🧠','2–3L', 'BIEN',         'Bien hidratado'],
                  [s.green,'🏆','3L+',  'ÓPTIMO',       'Máximo rendimiento'],
                ].map(([c,em,rng,lbl,desc])=>(
                  <div key={lbl} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',marginBottom:8,borderRadius:8,border:`2px solid ${aguaSt.label===lbl?c:'transparent'}`,background:aguaSt.label===lbl?`${c}12`:s.surf2,transition:'all .3s'}}>
                    <div style={{fontSize:26,flexShrink:0}}>{em}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontSize:16,fontWeight:900,color:c,letterSpacing:1}}>{lbl}</div>
                        <div style={{fontSize:10,color:s.muted}}>{rng}</div>
                      </div>
                      <div style={{fontSize:11,color:s.muted,marginTop:2}}>{desc}</div>
                    </div>
                    {aguaSt.label===lbl&&<div style={{color:c,fontSize:16}}>◀</div>}
                  </div>
                ))}
                <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',margin:'16px 0 10px'}}>ESTA SEMANA</div>
                <div style={{display:'flex',gap:6}}>
                  {weekDates.map((fecha,i)=>{
                    const l=aguaWeek[fecha]||0
                    const c=l>=3?s.green:l>=2?s.gold:l>=1?s.orange:s.border2
                    return <div key={fecha} style={{flex:1,textAlign:'center'}}>
                      <div style={{fontSize:9,color:fecha===todayISO?s.accent:s.muted}}>{DAYS_S[i]}</div>
                      <div style={{height:44,background:s.border2,borderRadius:4,marginTop:4,overflow:'hidden',position:'relative'}}>
                        <div style={{position:'absolute',bottom:0,left:0,right:0,height:Math.min(100,l/3*100)+'%',background:c,transition:'height .3s'}}/>
                      </div>
                      <div style={{fontSize:8,color:s.muted,marginTop:2}}>{l>0?l.toFixed(1):''}</div>
                    </div>
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUPLEMENTOS */}
        {page==='suplementos'&&(
          <div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Suplementos</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>CHECK DIARIO + HISTORIAL SEMANAL · {supsHoy}/{SUPLEMENTOS_LIST.length} HOY</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              {SUPLEMENTOS_LIST.map(sup=>(
                <div key={sup.id} style={{...C.card,cursor:'pointer',border:`1px solid ${suplementos[sup.id]?sup.color:s.border}`,background:suplementos[sup.id]?`${sup.color}0d`:s.surf,transition:'all .2s'}}>
                  <div onClick={()=>toggleSuplemento(sup.id)} style={{textAlign:'center',padding:'4px 0 12px'}}>
                    <div style={{fontSize:36,marginBottom:8}}>{sup.emoji}</div>
                    <div style={{fontSize:15,fontWeight:800,color:suplementos[sup.id]?sup.color:s.text,marginBottom:2}}>{sup.nombre}</div>
                    <div style={{fontSize:11,color:s.muted,marginBottom:4}}>{sup.dosis}</div>
                    <div style={{fontSize:10,color:s.muted,marginBottom:12}}>{sup.timing}</div>
                    <div style={{background:suplementos[sup.id]?sup.color:'transparent',border:`1px solid ${suplementos[sup.id]?sup.color:s.border}`,borderRadius:6,padding:'6px 12px',fontSize:12,fontWeight:700,color:suplementos[sup.id]?'#000':s.muted}}>
                      {suplementos[sup.id]?'✅ Tomado':'○ Pendiente'}
                    </div>
                  </div>
                  <div style={{borderTop:`1px solid ${s.border}`,paddingTop:10,marginTop:4}}>
                    <div style={{fontSize:9,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:6,textAlign:'center'}}>SEMANA</div>
                    <div style={{display:'flex',gap:4,justifyContent:'center'}}>
                      {weekDates.map((fecha,i)=>{
                        const taken=suplWeek[`${fecha}-${sup.id}`]
                        return <div key={fecha} title={DAYS_ES[i]} style={{width:18,height:18,borderRadius:3,border:`1px solid ${taken?sup.color:s.border2}`,background:taken?sup.color:'transparent',transition:'all .2s'}}/>
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUTRICIÓN */}
        {page==='nutricion'&&(
          <div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Nutrición</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>BULK LIMPIO · 2,850 KCAL · 148G PROTEÍNA</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
              {[['Calorías',totalCals,2850,'kcal',s.accent],['Proteína',totalProt,148,'g',s.blue],['Carbos',totalCarbs,320,'g',s.green],['Grasas',totalFats,80,'g',s.gold]].map(([l,v,obj,u,c])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:9,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>{l}</div>
                  <div style={{fontSize:24,fontWeight:900,color:c}}>{v}<span style={{fontSize:12,color:s.muted}}>{u}</span></div>
                  <div style={{fontSize:10,color:s.muted,marginBottom:6}}>/ {obj}{u}</div>
                  <div style={{height:4,background:s.border2,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(v/obj*100,100)+'%',background:c,borderRadius:2}}/></div>
                </div>
              ))}
            </div>
            <div style={{...C.card,marginBottom:16,border:`1px solid rgba(232,255,60,.2)`,background:'rgba(232,255,60,.03)'}}>
              <div style={{fontSize:10,color:s.accent,letterSpacing:3,textTransform:'uppercase',marginBottom:8}}>⚡ ANÁLISIS IA — FOTO DE COMIDA</div>
              <div style={{fontSize:12,color:s.muted,marginBottom:14}}>Subí una foto y la IA calcula calorías, proteína, carbs y grasas.</div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={analyzePhoto}/>
              <button onClick={()=>fileRef.current?.click()} style={{...C.btn,background:s.surf2,border:`1px solid ${s.border}`,color:s.text,marginBottom:12}}>📸 Subir foto de comida</button>
              {aiLoading&&<div style={{padding:'12px 16px',background:s.surf2,borderRadius:8,color:s.accent,fontSize:13}}>⏳ Analizando...</div>}
              {aiResult&&(
                <div style={{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:10,padding:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <div style={{fontSize:15,fontWeight:700}}>{aiResult.nombre}</div>
                    <div style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:6,background:aiResult.confianza==='alta'?'rgba(60,255,180,.15)':'rgba(212,168,67,.15)',color:aiResult.confianza==='alta'?s.green:s.gold}}>{aiResult.confianza?.toUpperCase()} CONFIANZA</div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:12}}>
                    {[['KCAL',aiResult.kcal,s.accent],['PROT',aiResult.proteina+'g',s.blue],['CARBS',aiResult.carbohidratos+'g',s.green],['GRASAS',aiResult.grasas+'g',s.gold]].map(([l,v,c])=>(
                      <div key={l} style={{textAlign:'center',padding:'10px 8px',background:s.surf3,borderRadius:8,border:`1px solid ${s.border}`}}>
                        <div style={{fontSize:18,fontWeight:900,color:c}}>{v}</div>
                        <div style={{fontSize:9,color:s.muted,letterSpacing:2,marginTop:3}}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {aiResult.descripcion&&<div style={{fontSize:11,color:s.muted,marginBottom:12}}>{aiResult.descripcion}</div>}
                  <button onClick={addAiFood} style={{...C.btn,background:s.accent,color:'#000',width:'100%'}}>+ Agregar a hoy</button>
                </div>
              )}
            </div>
            <div style={{...C.card,marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:10}}>+ Agregar manual</div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr auto',gap:8,alignItems:'flex-end'}}>
                {[['nombre','Alimento','Ej: Pollo'],['cals','Kcal','0'],['proteina','Prot g','0'],['carbos','Carbs g','0'],['grasas','Grasas g','0']].map(([k,l,ph])=>(
                  <div key={k}>
                    <div style={{fontSize:9,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>{l}</div>
                    <input style={C.inp} placeholder={ph} value={foodForm[k]} onChange={e=>setFoodForm(p=>({...p,[k]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addFood()}/>
                  </div>
                ))}
                <button onClick={addFood} style={{...C.btn,background:s.accent,color:'#000',height:38,padding:'0 16px'}}>+</button>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {todayFoods.length===0?<div style={{color:s.muted,fontSize:13,padding:12}}>Sin alimentos hoy.</div>:
              todayFoods.map(f=>(
                <div key={f.id} style={{...C.card,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px'}}>
                  <div style={{fontSize:13,fontWeight:600,minWidth:140}}>{f.nombre}</div>
                  <div style={{display:'flex',gap:14,fontSize:11,color:s.muted}}>
                    <span>P:<b style={{color:s.blue}}>{f.proteina}g</b></span>
                    <span>C:<b style={{color:s.green}}>{f.carbos}g</b></span>
                    <span>G:<b style={{color:s.gold}}>{f.grasas}g</b></span>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:s.accent}}>{f.cals}kcal</div>
                  <button onClick={()=>removeFood(f.id)} style={{...C.btn,background:'rgba(255,60,60,.1)',border:`1px solid rgba(255,60,60,.2)`,color:s.red,padding:'4px 10px',fontSize:11}}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESO */}
        {page==='progreso'&&(
          <div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Progreso</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>TODO LO QUE HICISTE · RESUMEN MENSUAL</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
              {[['Peso',pesoActual+' kg',lastMedida?((+pesoActual-73.6)>=0?'+':'')+((+pesoActual-73.6).toFixed(1))+' kg':'Baseline',true],['Músculo',musculoActual+' kg',lastMedida?((+musculoActual-35.6)>=0?'+':'')+((+musculoActual-35.6).toFixed(1))+' kg':'Baseline',true],['% Grasa',grasaPct+'%','≤ 16% objetivo',+grasaPct<=16],['Días gym',diasGymTotal+' días','Historial completo',diasGymTotal>=20]].map(([l,v,d,pos])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:9,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>{l}</div>
                  <div style={{fontSize:24,fontWeight:900}}>{v}</div>
                  <div style={{fontSize:11,color:pos?s.green:s.muted,marginTop:4}}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{...C.card,marginBottom:20}}>
              <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>📅 DÍAS AL GYM ESTA SEMANA</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8}}>
                {weekDates.map((fecha,i)=>{
                  const fue=gymWeek[fecha],isToday=fecha===todayISO
                  return <div key={fecha} onClick={()=>toggleGymDay(fecha)} style={{textAlign:'center',padding:'12px 4px',borderRadius:8,border:`1px solid ${isToday?s.accent:fue?s.green:s.border}`,background:fue?'rgba(60,255,180,.06)':s.surf2,cursor:'pointer',transition:'all .2s'}}>
                    <div style={{fontSize:9,color:isToday?s.accent:s.muted,letterSpacing:1,marginBottom:6}}>{DAYS_ES[i]}</div>
                    <div style={{fontSize:22}}>{fue?'✅':'⬜'}</div>
                  </div>
                })}
              </div>
            </div>
            {/* Records */}
            <div style={{...C.card,marginBottom:20}}>
              <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>🏅 RÉCORDS POR EJERCICIO (lbs)</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {DAYS.flatMap(d=>ROUTINES[d].exercises).filter(e=>getRecord(e.id)).map(e=>{
                  const record=getRecord(e.id)
                  const todayVal=Number(getTodayLbs(e.id)||0)
                  const isToday=todayVal>0&&todayVal===record
                  return <div key={e.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:s.surf2,border:`1px solid ${isToday?s.gold:s.border}`,borderRadius:8}}>
                    <div style={{fontSize:12,color:s.text,fontWeight:500}}>{e.name}</div>
                    <div style={{fontSize:13,fontWeight:700,color:isToday?s.gold:s.muted}}>{record} lbs{isToday?' 🏅':''}</div>
                  </div>
                })}
              </div>
            </div>
            <div style={{...C.card,marginBottom:20}}>
              <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>📊 RESUMEN</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                {[['Días gym',diasGymTotal+' días',s.green],['Supls hoy',supsHoy+'/'+SUPLEMENTOS_LIST.length,s.accent],['Agua hoy',aguaL.toFixed(1)+'L',s.blue],['Streak',streak+' días 🔥',s.purple]].map(([l,v,c])=>(
                  <div key={l} style={{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:8,padding:'14px 16px'}}>
                    <div style={{fontSize:9,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:6}}>{l}</div>
                    <div style={{fontSize:20,fontWeight:900,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={C.card}>
              <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>HISTORIAL BODY</div>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Fecha','Peso','Músculo','Grasa%','InBody','Delta'].map(h=><th key={h} style={{fontSize:9,color:s.muted,textAlign:'left',padding:'6px 10px',borderBottom:`1px solid ${s.border}`,letterSpacing:2}}>{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>
                  <tr>{['Mayo 2026','73.6 kg','35.6 kg','15%','80','—'].map((v,i)=><td key={i} style={{padding:'10px',fontSize:12,borderBottom:`1px solid ${s.border}`,color:i===3?s.gold:i===4?s.accent:s.text}}>{v}</td>)}</tr>
                  {medidas.map((m,idx)=>{
                    const prev=medidas[idx+1]
                    const delta=prev?((m.musculo-prev.musculo)>=0?'+':'')+((m.musculo-prev.musculo).toFixed(1))+'kg':'—'
                    return <tr key={m.id}>{[m.fecha,m.peso+'kg',m.musculo+'kg',m.grasa_pct+'%',m.inbody||'—',delta].map((v,i)=><td key={i} style={{padding:'10px',fontSize:12,borderBottom:`1px solid ${s.border}`,color:i===3?s.gold:i===4?s.accent:i===5?(delta.startsWith('+')?s.green:s.red):s.text}}>{v}</td>)}</tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOTIVACIÓN */}
        {page==='motivacion'&&(
          <div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Motivación</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>FRASES · CIENCIA DEL MÚSCULO · TU META</div>
            </div>
            <div style={{background:`linear-gradient(135deg,rgba(232,255,60,.07),rgba(60,255,180,.04))`,border:`1px solid rgba(232,255,60,.2)`,borderRadius:14,padding:'28px 32px',marginBottom:20,textAlign:'center'}}>
              <div style={{fontSize:13,color:s.muted,letterSpacing:3,marginBottom:16}}>💬 FRASE DEL DÍA</div>
              <div style={{fontSize:20,color:s.text,fontStyle:'italic',fontWeight:500,lineHeight:1.6,marginBottom:12,maxWidth:600,margin:'0 auto 12px'}}>"{FRASES_MOTIVACION[motivIdx].text}"</div>
              <div style={{fontSize:12,color:s.muted,marginBottom:20}}>{FRASES_MOTIVACION[motivIdx].src}</div>
              <button onClick={()=>setMotivIdx(i=>(i+1)%FRASES_MOTIVACION.length)} style={{...C.btn,background:'transparent',border:`1px solid ${s.border}`,color:s.muted,fontSize:12}}>↻ Siguiente frase</button>
            </div>
            <div style={{fontSize:11,color:s.muted,letterSpacing:3,textTransform:'uppercase',marginBottom:12}}>📊 CIENCIA DEL BULK</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              {DATOS_BULK.map(d=>(
                <div key={d.titulo} style={{...C.card,borderLeft:`3px solid ${s.accent}`}}>
                  <div style={{fontSize:10,fontWeight:700,color:s.accent,letterSpacing:2,marginBottom:6}}>{d.titulo}</div>
                  <div style={{fontSize:13,color:s.text,lineHeight:1.6,marginBottom:6}}>{d.dato}</div>
                  <div style={{fontSize:10,color:s.muted}}>Fuente: {d.fuente}</div>
                </div>
              ))}
            </div>
            <div style={{...C.card,background:'linear-gradient(135deg,rgba(60,255,180,.05),rgba(232,255,60,.03))',border:`1px solid rgba(60,255,180,.15)`}}>
              <div style={{fontSize:11,color:s.green,letterSpacing:3,marginBottom:16}}>🎯 TU META — BULK 2026</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                {[['Músculo meta','+3-4 kg',s.green,musculoActual+' kg actual','→ 38-39 kg'],['Grasa máx','≤ 16%',s.gold,grasaPct+'% actual',grasaPct<=16?'✅ En objetivo':'⚠️ Monitorear'],['Peso meta','77-78 kg',s.blue,pesoActual+' kg actual','+'+(77-pesoActual).toFixed(1)+' kg por ganar']].map(([l,v,c,cur,note])=>(
                  <div key={l} style={{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:10,padding:18,textAlign:'center'}}>
                    <div style={{fontSize:9,color:s.muted,letterSpacing:2,marginBottom:8}}>{l.toUpperCase()}</div>
                    <div style={{fontSize:28,fontWeight:900,color:c,marginBottom:4}}>{v}</div>
                    <div style={{fontSize:11,color:s.muted,marginBottom:4}}>{cur}</div>
                    <div style={{fontSize:11,color:c}}>{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MEDIDAS */}
        {page==='medidas'&&(
          <div>
            <div style={{marginBottom:24}}><div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Medidas Corporales</div></div>
            <div style={{...C.card,marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:700,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>📋 Nueva medición</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
                {[['peso','Peso (kg)','73.6'],['musculo','Músculo (kg)','35.6'],['grasa_kg','Grasa (kg)','11'],['grasa_pct','% Grasa','15'],['cintura','Cintura (cm)',''],['bicep','Bícep D (cm)',''],['inbody','InBody Score','80'],['notas','Notas','']].map(([k,l,ph])=>(
                  <div key={k}>
                    <div style={{fontSize:9,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>{l}</div>
                    <input style={C.inp} placeholder={ph} value={medForm[k]} onChange={e=>setMedForm(p=>({...p,[k]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              <button onClick={saveMedida} style={{...C.btn,background:s.accent,color:'#000'}}>💾 Guardar medición</button>
            </div>
            {medidas.length>0&&(
              <div style={C.card}>
                <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>HISTORIAL</div>
                {medidas.slice(0,5).map(m=>(
                  <div key={m.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${s.border}`,fontSize:12}}>
                    <span style={{color:s.muted}}>{m.fecha}</span>
                    <span>{m.peso}kg</span>
                    <span style={{color:s.green}}>{m.musculo}kg músculo</span>
                    <span style={{color:s.gold}}>{m.grasa_pct}% grasa</span>
                    <span style={{color:s.accent}}>InBody: {m.inbody||'—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {toast&&<div style={{position:'fixed',bottom:28,right:28,background:s.accent,color:'#000',padding:'10px 20px',borderRadius:8,fontWeight:700,fontSize:13,zIndex:300,boxShadow:'0 4px 20px rgba(0,0,0,.5)'}}>{toast}</div>}
    </div>
  )
}
