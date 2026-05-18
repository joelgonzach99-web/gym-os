import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

// ─── DATOS ───────────────────────────────────────────────────────────────────

const FRASES = [
  { text: "El dolor de hoy es la fuerza de mañana.", src: "— Arnold Schwarzenegger" },
  { text: "No pares cuando estés cansado. Pará cuando hayas terminado.", src: "— David Goggins" },
  { text: "Tu cuerpo puede hacerlo. Es tu mente la que tenés que convencer.", src: "— GYM OS" },
  { text: "Cada rep te acerca más a quien querés ser.", src: "— GYM OS" },
  { text: "Disciplina es elegir lo que querés más sobre lo que querés ahora.", src: "— GYM OS" },
  { text: "Los campeones no se hacen en el gym. Se revelan ahí.", src: "— Joe Weider" },
  { text: "Levantate, trabajá duro, sé disciplinado. Repetí.", src: "— GYM OS" },
  { text: "148g de proteína. Cada día. Sin excusas.", src: "— Plan Bulk 2026" },
  { text: "Tu grasa actual ya es historia. Construí lo que sigue.", src: "— GYM OS" },
  { text: "El gym no es castigo. Es inversión.", src: "— GYM OS" },
  { text: "Seis meses de disciplina o toda tu vida deseando haber empezado.", src: "— GYM OS" },
  { text: "Los records se rompen una sola vez. Hasta que los rompés de nuevo.", src: "— GYM OS" },
  { text: "No busques motivación. Creala con acciones.", src: "— GYM OS" },
  { text: "La creatina no trabaja sin vos. Pero con vos, trabaja.", src: "— Ciencia del Fitness" },
  { text: "El músculo se construye en el plato y se prueba en el gym.", src: "— GYM OS" },
]

const FRASES_MOTIVACION = [
  { text: "El éxito no es final, el fracaso no es fatal: es el coraje de continuar lo que cuenta.", src: "— Winston Churchill" },
  { text: "Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto sino un hábito.", src: "— Aristóteles" },
  { text: "No cuentes los días. Hacé que los días cuenten.", src: "— Muhammad Ali" },
  { text: "El único mal entrenamiento es el que no hiciste.", src: "— GYM OS" },
  { text: "Tu cuerpo puede soportar casi todo. Es tu mente la que hay que entrenar.", src: "— GYM OS" },
  { text: "No se trata de ser mejor que los demás. Se trata de ser mejor que quien eras ayer.", src: "— Jigoro Kano" },
  { text: "Pequeño progreso cada día suma a grandes resultados.", src: "— Satya Nani" },
  { text: "El dolor que sentís hoy será la fuerza que sentís mañana.", src: "— Arnold Schwarzenegger" },
  { text: "Cuando pensás en rendirte, recordá por qué empezaste.", src: "— GYM OS" },
  { text: "La disciplina es el puente entre metas y logros.", src: "— Jim Rohn" },
]

const DATOS_BULK = [
  { titulo: "SÍNTESIS PROTEICA", dato: "El músculo se repara 24-48h post-entreno. La proteína importa incluso en días de descanso.", fuente: "Sports Medicine Journal" },
  { titulo: "CREATINA + BULK", dato: "5g diarios de creatina aumenta la fuerza en 5-15% y el volumen muscular por retención de agua intracelular.", fuente: "International Journal of Sport Nutrition" },
  { titulo: "SUEÑO = MÚSCULO", dato: "El 70% de la hormona de crecimiento (HGH) se libera en sueño profundo. Dormir mal = bulk lento.", fuente: "Journal of Clinical Endocrinology" },
  { titulo: "PROGRESSIVE OVERLOAD", dato: "El único principio garantizado en hipertrofia: agregar peso, reps o sets cada semana.", fuente: "Schoenfeld 2010" },
  { titulo: "HIDRATACIÓN Y FUERZA", dato: "Con 2% de deshidratación la fuerza muscular cae hasta un 20%. 3L diarios no es opcional.", fuente: "Journal of Athletic Training" },
  { titulo: "DÉFICIT = ERROR", dato: "En bulk limpio el superávit debe ser 200-300 kcal. Más = más grasa. Menos = sin músculo nuevo.", fuente: "Alan Aragon Research Review" },
  { titulo: "PROTEÍNA ÓPTIMA", dato: "1.6-2.2g por kg de peso corporal maximiza la síntesis proteica. Para vos: 118-163g/día.", fuente: "Morton et al. 2018" },
  { titulo: "FRECUENCIA DE ENTRENAMIENTO", dato: "Entrenar cada músculo 2x por semana produce 48% más hipertrofia que 1x por semana.", fuente: "Schoenfeld Meta-Análisis 2016" },
]

const SUPLEMENTOS_LIST = [
  { id: 'creatina',   nombre: 'Creatina',   dosis: '5g',     emoji: '⚡', color: '#e8ff3c', timing: 'Cualquier hora, con agua' },
  { id: 'proteina',   nombre: 'Proteína',   dosis: '30g',    emoji: '💪', color: '#3cffb4', timing: 'Post-entreno' },
  { id: 'vitamina_c', nombre: 'Vitamina C', dosis: '1000mg', emoji: '🍊', color: '#ff9f3c', timing: 'Con comida' },
  { id: 'omega3',     nombre: 'Omega 3',    dosis: '2 caps', emoji: '🐟', color: '#3c9fff', timing: 'Con comidas' },
  { id: 'vitamina_d', nombre: 'Vitamina D', dosis: '2000IU', emoji: '☀️', color: '#ffd93c', timing: 'Con comida grasa' },
  { id: 'magnesio',   nombre: 'Magnesio',   dosis: '400mg',  emoji: '🌙', color: '#c47fff', timing: 'Antes de dormir' },
]

// Ejercicios con silueta SVG inline (músculo principal en cada uno)
const ROUTINES = {
  lunes: {
    title: 'PECHO', badge: 'PUSH', color: '#e8ff3c', singleMuscle: 'Pecho + Tríceps',
    exercises: [
      { id: 'l1', name: 'Press de banca plano', detail: '4 × 8-10 reps · 60-70% 1RM', muscle: 'Pecho', svg: 'chest' },
      { id: 'l2', name: 'Press inclinado mancuernas', detail: '4 × 10-12 reps', muscle: 'Pecho Alto', svg: 'chest' },
      { id: 'l3', name: 'Aperturas en polea baja', detail: '3 × 12-15 reps', muscle: 'Pecho Medio', svg: 'chest' },
      { id: 'l4', name: 'Fondos en paralelas', detail: '3 × 10-12 reps', muscle: 'Pecho Bajo / Tríceps', svg: 'triceps' },
      { id: 'l5', name: 'Press francés barra EZ', detail: '3 × 10-12 reps', muscle: 'Tríceps Largo', svg: 'triceps' },
      { id: 'l6', name: 'Extensiones tríceps polea', detail: '3 × 12-15 reps', muscle: 'Tríceps Lateral', svg: 'triceps' },
      { id: 'l7', name: 'Aperturas mancuernas planas', detail: '3 × 12 reps', muscle: 'Pecho Completo', svg: 'chest' },
      { id: 'l8', name: 'Pushdown polea alta agarre neutro', detail: '2 × 15 reps · finalizador', muscle: 'Tríceps', svg: 'triceps' },
    ],
  },
  martes: {
    title: 'ESPALDA', badge: 'PULL', color: '#3c9fff', singleMuscle: 'Espalda + Bíceps',
    exercises: [
      { id: 'm1', name: 'Dominadas lastre o asistidas', detail: '4 × 6-10 reps', muscle: 'Dorsal Ancho', svg: 'back' },
      { id: 'm2', name: 'Remo con barra pronado', detail: '4 × 8-10 reps', muscle: 'Dorsal / Romboides', svg: 'back' },
      { id: 'm3', name: 'Jalón al pecho agarre neutro', detail: '3 × 10-12 reps', muscle: 'Dorsal', svg: 'back' },
      { id: 'm4', name: 'Remo en polea sentado', detail: '3 × 12 reps', muscle: 'Espalda Media', svg: 'back' },
      { id: 'm5', name: 'Pullover con mancuerna', detail: '3 × 12-15 reps', muscle: 'Dorsal / Serrato', svg: 'back' },
      { id: 'm6', name: 'Curl con barra EZ', detail: '4 × 8-10 reps', muscle: 'Bíceps', svg: 'biceps' },
      { id: 'm7', name: 'Curl martillo alterno', detail: '3 × 10-12 reps', muscle: 'Bíceps / Braquial', svg: 'biceps' },
      { id: 'm8', name: 'Curl en polea alta', detail: '2 × 15 reps · finalizador', muscle: 'Bíceps Pico', svg: 'biceps' },
    ],
  },
  miercoles: {
    title: 'PIERNAS', badge: 'LEGS A', color: '#ff3c3c', singleMuscle: 'Cuádriceps + Glúteos',
    exercises: [
      { id: 'x1', name: 'Sentadilla libre high bar', detail: '4 × 6-8 reps · pesado', muscle: 'Cuádriceps / Glúteo', svg: 'legs' },
      { id: 'x2', name: 'Prensa de piernas 45°', detail: '4 × 10-12 reps', muscle: 'Cuádriceps', svg: 'legs' },
      { id: 'x3', name: 'Sentadilla hack', detail: '3 × 12 reps', muscle: 'Cuádriceps', svg: 'legs' },
      { id: 'x4', name: 'Extensiones de cuádriceps', detail: '3 × 15 reps', muscle: 'Cuádriceps Aislado', svg: 'legs' },
      { id: 'x5', name: 'Hip thrust con barra', detail: '4 × 10-12 reps', muscle: 'Glúteo Mayor', svg: 'glutes' },
      { id: 'x6', name: 'Curl femoral acostado', detail: '3 × 12 reps', muscle: 'Femoral', svg: 'hamstring' },
      { id: 'x7', name: 'Pantorrillas de pie', detail: '5 × 15-20 reps', muscle: 'Gemelos', svg: 'calves' },
      { id: 'x8', name: 'Abductores en máquina', detail: '3 × 15-20 reps', muscle: 'Glúteo Medio', svg: 'glutes' },
    ],
  },
  jueves: {
    title: 'HOMBROS', badge: 'DELTS', color: '#d4a843', singleMuscle: 'Hombros + Core',
    exercises: [
      { id: 'j1', name: 'Press militar con barra', detail: '4 × 6-8 reps', muscle: 'Deltoides Frontal/Medio', svg: 'shoulders' },
      { id: 'j2', name: 'Press Arnold mancuernas', detail: '3 × 10-12 reps', muscle: 'Deltoides 360°', svg: 'shoulders' },
      { id: 'j3', name: 'Elevaciones laterales cable', detail: '4 × 15 reps · técnica estricta', muscle: 'Deltoides Medio', svg: 'shoulders' },
      { id: 'j4', name: 'Face pulls polea alta', detail: '4 × 15-20 reps', muscle: 'Deltoides Posterior', svg: 'shoulders' },
      { id: 'j5', name: 'Elevaciones frontales disco', detail: '3 × 12 reps', muscle: 'Deltoides Frontal', svg: 'shoulders' },
      { id: 'j6', name: 'Encogimientos de hombros', detail: '3 × 12-15 reps', muscle: 'Trapecios', svg: 'traps' },
      { id: 'j7', name: 'Plancha frontal', detail: '3 × 45-60 seg', muscle: 'Core', svg: 'core' },
      { id: 'j8', name: 'Plancha lateral', detail: '3 × 30-45 seg c/lado', muscle: 'Oblicuos', svg: 'core' },
    ],
  },
  viernes: {
    title: 'FEMORALES', badge: 'PULL 2', color: '#3cffb4', singleMuscle: 'Espalda Baja + Isquios',
    exercises: [
      { id: 'v1', name: 'Peso muerto convencional', detail: '5 × 4-6 reps · 80-85% 1RM', muscle: 'Cadena Posterior', svg: 'back' },
      { id: 'v2', name: 'Peso muerto rumano', detail: '3 × 10-12 reps', muscle: 'Femoral / Glúteo', svg: 'hamstring' },
      { id: 'v3', name: 'Buenos días con barra', detail: '3 × 10-12 reps', muscle: 'Lumbar / Femoral', svg: 'back' },
      { id: 'v4', name: 'Curl femoral sentado', detail: '4 × 10-12 reps', muscle: 'Femoral Aislado', svg: 'hamstring' },
      { id: 'v5', name: 'Hiperextensiones', detail: '3 × 15 reps', muscle: 'Lumbar', svg: 'back' },
      { id: 'v6', name: 'Zancadas caminando', detail: '3 × 12 reps c/lado', muscle: 'Cuádriceps / Glúteo', svg: 'legs' },
      { id: 'v7', name: 'Sentadilla búlgara', detail: '3 × 10 reps c/lado', muscle: 'Cuádriceps / Balance', svg: 'legs' },
      { id: 'v8', name: 'Abdominal en polea', detail: '3 × 15-20 reps', muscle: 'Core', svg: 'core' },
    ],
  },
  sabado: {
    title: 'BRAZOS', badge: 'PUSH 2', color: '#c47fff', singleMuscle: 'Pecho Vol. + Hombros',
    exercises: [
      { id: 's1', name: 'Press inclinado barra', detail: '4 × 8-10 reps', muscle: 'Pecho Alto', svg: 'chest' },
      { id: 's2', name: 'Aperturas mancuernas plano', detail: '3 × 12 reps', muscle: 'Pecho Medio', svg: 'chest' },
      { id: 's3', name: 'Cruces en polea', detail: '3 × 15 reps', muscle: 'Pecho / Contracción', svg: 'chest' },
      { id: 's4', name: 'Elevaciones laterales mancuerna', detail: '5 × 15 reps · descanso 45s', muscle: 'Deltoides Medio', svg: 'shoulders' },
      { id: 's5', name: 'Curl bíceps concentrado', detail: '4 × 10-12 reps', muscle: 'Bíceps Pico', svg: 'biceps' },
      { id: 's6', name: 'Press cerrado barra', detail: '3 × 8-10 reps', muscle: 'Tríceps', svg: 'triceps' },
      { id: 's7', name: 'Curl 21s', detail: '3 × 21 reps (7+7+7)', muscle: 'Bíceps Completo', svg: 'biceps' },
      { id: 's8', name: 'Kickbacks tríceps cable', detail: '3 × 15 reps', muscle: 'Tríceps Lateral', svg: 'triceps' },
    ],
  },
  domingo: {
    title: 'DESCANSO', badge: 'REST', color: '#555', singleMuscle: 'Recuperación Activa',
    exercises: [
      { id: 'd1', name: 'Caminata 30-45 minutos', detail: 'Ritmo moderado, al aire libre', muscle: 'Cardio Suave', svg: 'cardio' },
      { id: 'd2', name: 'Stretching full body', detail: '15-20 minutos', muscle: 'Movilidad', svg: 'stretch' },
      { id: 'd3', name: 'Foam rolling', detail: '10 minutos grupos trabajados', muscle: 'Recuperación Miofascial', svg: 'stretch' },
      { id: 'd4', name: 'Visualización y meal prep', detail: 'Preparar la semana', muscle: 'Mental', svg: 'cardio' },
    ],
  },
}

const DAYS    = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
const DAYS_ES = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
const DAYS_SHORT = ['L','M','X','J','V','S','D']

// ─── SVG SILUETAS de músculo ──────────────────────────────────────────────────
const MUSCLE_SVG = {
  chest: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="16" cy="22" rx="10" ry="8" fill="#e8ff3c" opacity="0.7"/>
      <ellipse cx="32" cy="22" rx="10" ry="8" fill="#e8ff3c" opacity="0.7"/>
      <rect x="18" y="14" width="12" height="4" rx="2" fill="#e8ff3c" opacity="0.4"/>
    </svg>
  ),
  triceps: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="16" cy="24" rx="5" ry="14" fill="#e8ff3c" opacity="0.3"/>
      <ellipse cx="32" cy="24" rx="5" ry="14" fill="#e8ff3c" opacity="0.3"/>
      <ellipse cx="16" cy="28" rx="4" ry="8" fill="#e8ff3c" opacity="0.7"/>
      <ellipse cx="32" cy="28" rx="4" ry="8" fill="#e8ff3c" opacity="0.7"/>
    </svg>
  ),
  biceps: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="16" cy="20" rx="4" ry="11" fill="#3c9fff" opacity="0.7"/>
      <ellipse cx="32" cy="20" rx="4" ry="11" fill="#3c9fff" opacity="0.7"/>
      <ellipse cx="16" cy="26" rx="3" ry="6" fill="#3c9fff" opacity="0.4"/>
      <ellipse cx="32" cy="26" rx="3" ry="6" fill="#3c9fff" opacity="0.4"/>
    </svg>
  ),
  back: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M10 12 Q24 8 38 12 L36 36 Q24 40 12 36 Z" fill="#3c9fff" opacity="0.3"/>
      <ellipse cx="17" cy="22" rx="5" ry="10" fill="#3c9fff" opacity="0.7"/>
      <ellipse cx="31" cy="22" rx="5" ry="10" fill="#3c9fff" opacity="0.7"/>
      <rect x="21" y="12" width="6" height="24" rx="3" fill="#3c9fff" opacity="0.2"/>
    </svg>
  ),
  shoulders: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="10" cy="22" rx="8" ry="8" fill="#d4a843" opacity="0.7"/>
      <ellipse cx="38" cy="22" rx="8" ry="8" fill="#d4a843" opacity="0.7"/>
      <ellipse cx="24" cy="18" rx="6" ry="6" fill="#d4a843" opacity="0.3"/>
    </svg>
  ),
  legs: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="16" cy="24" rx="7" ry="16" fill="#ff3c3c" opacity="0.7"/>
      <ellipse cx="32" cy="24" rx="7" ry="16" fill="#ff3c3c" opacity="0.7"/>
    </svg>
  ),
  hamstring: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="16" cy="24" rx="6" ry="16" fill="#ff3c3c" opacity="0.3"/>
      <ellipse cx="32" cy="24" rx="6" ry="16" fill="#ff3c3c" opacity="0.3"/>
      <ellipse cx="16" cy="28" rx="5" ry="10" fill="#ff3c3c" opacity="0.7"/>
      <ellipse cx="32" cy="28" rx="5" ry="10" fill="#ff3c3c" opacity="0.7"/>
    </svg>
  ),
  glutes: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="16" cy="26" rx="10" ry="10" fill="#c47fff" opacity="0.7"/>
      <ellipse cx="32" cy="26" rx="10" ry="10" fill="#c47fff" opacity="0.7"/>
    </svg>
  ),
  calves: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <ellipse cx="16" cy="30" rx="5" ry="12" fill="#3cffb4" opacity="0.7"/>
      <ellipse cx="32" cy="30" rx="5" ry="12" fill="#3cffb4" opacity="0.7"/>
    </svg>
  ),
  traps: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M12 16 L24 8 L36 16 L34 28 L14 28 Z" fill="#d4a843" opacity="0.7"/>
    </svg>
  ),
  core: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="16" y="12" width="16" height="24" rx="4" fill="#3cffb4" opacity="0.2"/>
      {[0,1,2].map(i => <rect key={i} x="17" y={14 + i*8} width="14" height="5" rx="2" fill="#3cffb4" opacity="0.7"/>)}
    </svg>
  ),
  cardio: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M8 24 L16 14 L24 32 L32 18 L40 24" stroke="#3cffb4" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  stretch: (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="10" r="5" fill="#555"/>
      <path d="M24 15 L18 30 M24 15 L30 30 M18 30 L12 42 M30 30 L36 42" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  ),
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const s = {
  bg: '#080808', surf: '#101010', surf2: '#141414', surf3: '#1a1a1a',
  border: '#1e1e1e', border2: '#282828',
  text: '#f0f0f0', muted: '#444', muted2: '#666',
  accent: '#e8ff3c', green: '#3cffb4', red: '#ff3c3c',
  blue: '#3c9fff', gold: '#d4a843', purple: '#c47fff', orange: '#ff9f3c',
}

const C = {
  sidebar: { position: 'fixed', left: 0, top: 0, bottom: 0, width: 230, background: s.surf, borderRight: `1px solid ${s.border}`, display: 'flex', flexDirection: 'column', zIndex: 100, fontFamily: 'system-ui,sans-serif', overflowY: 'auto' },
  main: { marginLeft: 230, padding: '32px 40px', minHeight: '100vh', fontFamily: 'system-ui,sans-serif', background: s.bg, color: s.text, width: 'calc(100vw - 230px)', maxWidth: 'calc(100vw - 230px)', overflowX: 'hidden' },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: active ? s.accent : '#666', background: active ? 'rgba(232,255,60,.08)' : 'transparent', border: active ? `1px solid rgba(232,255,60,.12)` : '1px solid transparent', marginBottom: 2, transition: 'all .15s' }),
  card: { background: s.surf, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20 },
  inp: { background: s.surf2, border: `1px solid ${s.border}`, borderRadius: 8, padding: '9px 12px', color: s.text, fontFamily: 'system-ui,sans-serif', fontSize: 13, outline: 'none', width: '100%' },
  btn: { fontWeight: 700, padding: '9px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, transition: 'all .15s' },
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard')
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const [currentDay, setCurrentDay] = useState(DAYS[todayIdx])
  const [checks, setChecks] = useState({})
  const [weights, setWeights] = useState({})   // { exerciseId: { fecha: kg } }
  const [foods, setFoods] = useState([])
  const [medidas, setMedidas] = useState([])
  const [aguaL, setAguaL] = useState(0)        // en litros
  const [suplementos, setSuplementos] = useState({})
  const [suplWeek, setSuplWeek] = useState({}) // { 'fecha-id': true }
  const [asistencia, setAsistencia] = useState([])
  const [gymWeek, setGymWeek] = useState({})   // { fecha: true }
  const [foodForm, setFoodForm] = useState({ nombre: '', cals: '', proteina: '', carbos: '', grasas: '' })
  const [medForm, setMedForm] = useState({ peso: '', musculo: '', grasa_kg: '', grasa_pct: '', cintura: '', bicep: '', inbody: '', notas: '' })
  const [toast, setToast] = useState('')
  const [fraseIdx, setFraseIdx] = useState(0)
  const [motivFraseIdx, setMotivFraseIdx] = useState(0)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const fileRef = useRef()

  const today = new Date().toDateString()
  const todayISO = new Date().toISOString().split('T')[0]
  const fechaHoy = new Date().toLocaleDateString('es-ES')

  // Rotación automática de frases (sidebar/dashboard)
  useEffect(() => {
    const id = setInterval(() => setFraseIdx(i => (i + 1) % FRASES.length), 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [c, f, m, a, sup, asist, w, gw] = await Promise.all([
      supabase.from('gym_checks').select('*').eq('fecha', today),
      supabase.from('gym_foods').select('*').eq('fecha', today),
      supabase.from('gym_medidas').select('*').order('created_at', { ascending: false }),
      supabase.from('gym_agua').select('*').eq('fecha', today).single(),
      supabase.from('gym_suplementos').select('*').gte('fecha', getWeekStart()),
      supabase.from('gym_asistencia').select('*').order('created_at', { ascending: false }).limit(60),
      supabase.from('gym_weights').select('*').order('fecha', { ascending: false }).limit(200),
      supabase.from('gym_gymdays').select('*').gte('fecha', getWeekStart()),
    ])
    if (c.data) { const ch = {}; c.data.forEach(x => ch[x.exercise_id] = x.done); setChecks(ch) }
    if (f.data) setFoods(f.data)
    if (m.data) setMedidas(m.data)
    if (a.data) setAguaL(+(a.data.litros || 0))
    if (sup.data) {
      const byDate = {}
      const todaySups = {}
      sup.data.forEach(row => {
        SUPLEMENTOS_LIST.forEach(s => {
          if (row[s.id]) {
            byDate[`${row.fecha}-${s.id}`] = true
            if (row.fecha === todayISO) todaySups[s.id] = true
          }
        })
      })
      setSuplWeek(byDate)
      setSuplementos(todaySups)
    }
    if (asist.data) setAsistencia(asist.data)
    if (w.data) {
      const wmap = {}
      w.data.forEach(r => {
        if (!wmap[r.exercise_id]) wmap[r.exercise_id] = {}
        wmap[r.exercise_id][r.fecha] = r.kg
      })
      setWeights(wmap)
    }
    if (gw.data) {
      const gmap = {}
      gw.data.forEach(r => { gmap[r.fecha] = true })
      setGymWeek(gmap)
    }
  }

  function getWeekStart() {
    const d = new Date()
    const day = d.getDay() === 0 ? 6 : d.getDay() - 1
    d.setDate(d.getDate() - day)
    return d.toISOString().split('T')[0]
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2800) }

  // ── AGUA (litros) ─────────────────────────────────────────────────────────
  async function addAgua(delta) {
    const nuevo = Math.max(0, Math.min(6, +(aguaL + delta).toFixed(2)))
    setAguaL(nuevo)
    const existing = await supabase.from('gym_agua').select('id').eq('fecha', today).single()
    if (existing.data) await supabase.from('gym_agua').update({ litros: nuevo }).eq('id', existing.data.id)
    else await supabase.from('gym_agua').insert({ fecha: today, litros: nuevo })
    if (nuevo >= 3) showToast('🏆 ¡Meta de agua alcanzada!')
  }

  // ── SUPLEMENTOS ───────────────────────────────────────────────────────────
  async function toggleSuplemento(id) {
    const nuevo = { ...suplementos, [id]: !suplementos[id] }
    setSuplementos(nuevo)
    const newWeek = { ...suplWeek, [`${todayISO}-${id}`]: nuevo[id] }
    setSuplWeek(newWeek)
    const existing = await supabase.from('gym_suplementos').select('id').eq('fecha', todayISO).single()
    if (existing.data) await supabase.from('gym_suplementos').update({ [id]: nuevo[id] }).eq('id', existing.data.id)
    else await supabase.from('gym_suplementos').insert({ fecha: todayISO, [id]: nuevo[id] })
    if (nuevo[id]) showToast('✅ ' + SUPLEMENTOS_LIST.find(s => s.id === id)?.nombre + ' tomado!')
  }

  // ── DÍAS GYM ──────────────────────────────────────────────────────────────
  async function toggleGymDay(fecha) {
    const current = gymWeek[fecha]
    const updated = { ...gymWeek, [fecha]: !current }
    setGymWeek(updated)
    if (!current) {
      await supabase.from('gym_gymdays').upsert({ fecha, fue: true })
      showToast('🏋️ Día de gym registrado!')
    } else {
      await supabase.from('gym_gymdays').delete().eq('fecha', fecha)
    }
  }

  // ── RUTINA / CHECKS ───────────────────────────────────────────────────────
  async function toggleCheck(id) {
    const done = !checks[id]
    setChecks(prev => ({ ...prev, [id]: done }))
    const existing = await supabase.from('gym_checks').select('id').eq('fecha', today).eq('exercise_id', id).single()
    if (existing.data) await supabase.from('gym_checks').update({ done }).eq('id', existing.data.id)
    else await supabase.from('gym_checks').insert({ fecha: today, exercise_id: id, done })
  }

  async function saveWeight(exerciseId, kg) {
    const kgNum = parseFloat(kg)
    if (isNaN(kgNum) || kgNum <= 0) return
    setWeights(prev => ({ ...prev, [exerciseId]: { ...(prev[exerciseId] || {}), [todayISO]: kgNum } }))
    await supabase.from('gym_weights').upsert({ exercise_id: exerciseId, fecha: todayISO, kg: kgNum })
  }

  function getRecord(exerciseId) {
    const entries = weights[exerciseId]
    if (!entries) return null
    const vals = Object.values(entries).map(Number).filter(v => v > 0)
    return vals.length ? Math.max(...vals) : null
  }

  function getTodayWeight(exerciseId) {
    return weights[exerciseId]?.[todayISO] || ''
  }

  // ── NUTRICIÓN MANUAL ──────────────────────────────────────────────────────
  async function addFood() {
    if (!foodForm.nombre) return
    const f = { ...foodForm, fecha: today, cals: +foodForm.cals || 0, proteina: +foodForm.proteina || 0, carbos: +foodForm.carbos || 0, grasas: +foodForm.grasas || 0 }
    const { data } = await supabase.from('gym_foods').insert(f).select().single()
    if (data) { setFoods(prev => [...prev, data]); setFoodForm({ nombre: '', cals: '', proteina: '', carbos: '', grasas: '' }); showToast('✅ ' + f.nombre + ' agregado') }
  }

  async function removeFood(id) {
    await supabase.from('gym_foods').delete().eq('id', id)
    setFoods(prev => prev.filter(f => f.id !== id))
  }

  // ── NUTRICIÓN IA ──────────────────────────────────────────────────────────
  async function analyzePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setAiLoading(true)
    setAiResult(null)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1]
      const mediaType = file.type || 'image/jpeg'
      try {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
                { type: 'text', text: 'Analizá esta foto de comida. Estimá la cantidad en gramos y los valores nutricionales. Respondé SOLO JSON sin markdown: {"nombre":"","kcal":0,"proteina":0,"carbohidratos":0,"grasas":0,"descripcion":"breve descripción","confianza":"alta/media/baja"}' },
              ],
            }],
          }),
        })
        const data = await resp.json()
        const text = data.content?.map(x => x.text || '').join('')
        let parsed
        try { parsed = JSON.parse(text.replace(/```json|```/g, '').trim()) } catch { parsed = null }
        setAiResult(parsed)
      } catch { showToast('❌ Error conectando con IA') }
      setAiLoading(false)
    }
    reader.readAsDataURL(file)
  }

  async function addAiFood() {
    if (!aiResult) return
    const f = { nombre: aiResult.nombre, cals: aiResult.kcal || 0, proteina: aiResult.proteina || 0, carbos: aiResult.carbohidratos || 0, grasas: aiResult.grasas || 0, fecha: today }
    const { data } = await supabase.from('gym_foods').insert(f).select().single()
    if (data) { setFoods(prev => [...prev, data]); setAiResult(null); showToast('✅ ' + f.nombre + ' agregado desde foto') }
  }

  // ── MEDIDAS ───────────────────────────────────────────────────────────────
  async function saveMedida() {
    if (!medForm.peso) { showToast('⚠️ Ingresá el peso'); return }
    const m = { ...medForm, fecha: fechaHoy, peso: +medForm.peso, musculo: +medForm.musculo || 0, grasa_kg: +medForm.grasa_kg || 0, grasa_pct: +medForm.grasa_pct || 0, cintura: +medForm.cintura || 0, bicep: +medForm.bicep || 0, inbody: +medForm.inbody || 0 }
    const { data } = await supabase.from('gym_medidas').insert(m).select().single()
    if (data) { setMedidas(prev => [data, ...prev]); setMedForm({ peso: '', musculo: '', grasa_kg: '', grasa_pct: '', cintura: '', bicep: '', inbody: '', notas: '' }); showToast('💾 Medición guardada') }
  }

  // ── CALCULADOS ────────────────────────────────────────────────────────────
  const todayFoods = foods.filter(f => f.fecha === today)
  const totalCals  = todayFoods.reduce((a, f) => a + (+f.cals || 0), 0)
  const totalProt  = todayFoods.reduce((a, f) => a + (+f.proteina || 0), 0)
  const totalCarbs = todayFoods.reduce((a, f) => a + (+f.carbos || 0), 0)
  const totalFats  = todayFoods.reduce((a, f) => a + (+f.grasas || 0), 0)

  const r = ROUTINES[currentDay]
  const doneCnt = r.exercises.filter(e => checks[e.id]).length
  const pct = Math.round(doneCnt / r.exercises.length * 100)

  const lastMedida    = medidas[0]
  const pesoActual    = lastMedida?.peso || 73.6
  const musculoActual = lastMedida?.musculo || 35.6
  const grasaPct      = lastMedida?.grasa_pct || 15

  const diasGymTotal = asistencia.filter(a => a.fue).length
  const supsHoy      = SUPLEMENTOS_LIST.filter(s => suplementos[s.id]).length
  const yaFueHoy     = asistencia.find(a => a.fecha === today)

  // Streak
  let streak = 0
  const sortedAsist = [...asistencia].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  for (let i = 0; i < sortedAsist.length; i++) {
    const d = new Date(); d.setDate(d.getDate() - i)
    if (sortedAsist[i]?.fecha === d.toDateString()) streak++
    else break
  }

  // Semana para suplementos / gym (7 días actuales)
  function getWeekDates() {
    const dates = []
    const now = new Date()
    const dow = now.getDay() === 0 ? 6 : now.getDay() - 1
    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() - dow + i)
      dates.push(d.toISOString().split('T')[0])
    }
    return dates
  }

  const weekDates = getWeekDates()

  // Estado agua
  function aguaStatus() {
    if (aguaL < 1) return { label: 'Lejos de la meta 😬', color: s.red, emoji: '😴' }
    if (aguaL < 2) return { label: 'Regular 😐', color: s.orange, emoji: '💧' }
    if (aguaL < 2.5) return { label: 'Casi un genio 🧠', color: s.gold, emoji: '🧠' }
    return { label: '¡Lo lograste! 🏆', color: s.green, emoji: '🏆' }
  }
  const aguaSt = aguaStatus()

  const pages = [
    ['⚡', 'dashboard', 'Dashboard'],
    ['🏋️', 'rutina', 'Rutina'],
    ['💧', 'hidratacion', 'Hidratación'],
    ['💊', 'suplementos', 'Suplementos'],
    ['🥗', 'nutricion', 'Nutrición'],
    ['📈', 'progreso', 'Progreso'],
    ['🔥', 'motivacion', 'Motivación'],
    ['📏', 'medidas', 'Medidas'],
  ]

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex' }}>

      {/* ── SIDEBAR ── */}
      <div style={C.sidebar}>
        <div style={{ padding: '20px 18px 14px', borderBottom: `1px solid ${s.border}` }}>
          <div style={{ fontSize: 11, color: s.muted, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>FASE ACTUAL</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ background: 'rgba(232,255,60,.15)', border: '1px solid rgba(232,255,60,.3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: s.accent, letterSpacing: 1 }}>🔥 VOLUMEN</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: s.accent, letterSpacing: 2 }}>GYM OS</div>
          <div style={{ fontSize: 10, color: s.muted, letterSpacing: 2 }}>Joel · Bulk 2026</div>
        </div>

        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${s.border}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[[' Peso', pesoActual + 'kg', s.text], ['Grasa', grasaPct + '%', s.gold], ['Músculo', musculoActual + 'kg', s.green], ['Streak', streak + 'd 🔥', s.accent]].map(([l, v, c]) => (
            <div key={l} style={{ background: s.surf2, border: `1px solid ${s.border}`, borderRadius: 6, padding: '7px 10px' }}>
              <div style={{ fontSize: 8, color: s.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '10px 10px', flex: 1, overflowY: 'auto' }}>
          {pages.map(([icon, id, label]) => (
            <div key={id} style={C.navItem(page === id)} onClick={() => setPage(id)}>
              <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{icon}</span>{label}
            </div>
          ))}
        </div>

        {/* Frase rotativa sidebar */}
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${s.border}`, minHeight: 60 }}>
          <div style={{ fontSize: 10, color: s.muted, fontStyle: 'italic', lineHeight: 1.5, textAlign: 'center', transition: 'opacity .5s' }}>
            "{FRASES[fraseIdx].text}"
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={C.main}>

        {/* ════ DASHBOARD ════ */}
        {page === 'dashboard' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Panel General</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>BULK · {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</div>
            </div>

            {/* Frase rotativa grande */}
            <div style={{ background: `linear-gradient(135deg,rgba(232,255,60,.06),rgba(60,255,180,.03))`, border: `1px solid rgba(232,255,60,.15)`, borderRadius: 12, padding: '18px 24px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: s.muted, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>💬 FRASE DEL DÍA</div>
              <div style={{ fontSize: 15, color: s.text, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.5, marginBottom: 6 }}>"{FRASES[fraseIdx].text}"</div>
              <div style={{ fontSize: 11, color: s.muted }}>{FRASES[fraseIdx].src}</div>
            </div>

            {/* Stats principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                ['Peso', pesoActual + ' kg', s.text, 30, '→ 78 kg'],
                ['Músculo', musculoActual + ' kg', s.green, 40, '→ 38 kg'],
                ['Grasa', '15%', s.gold, 65, '≤ 16%'],
                ['Gym este mes', diasGymTotal + ' días', s.accent, Math.min(diasGymTotal / 24 * 100, 100), 'Meta: 24/mes'],
                ['Streak', streak + ' días 🔥', s.purple, Math.min(streak / 30 * 100, 100), 'Racha actual'],
              ].map(([l, v, c, p, m]) => (
                <div key={l} style={C.card}>
                  <div style={{ fontSize: 9, color: s.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: c }}>{v}</div>
                  <div style={{ fontSize: 10, color: s.muted, marginTop: 3 }}>{m}</div>
                  <div style={{ height: 4, background: s.border2, borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: p + '%', background: c, borderRadius: 2, transition: 'width .5s' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Semana gym */}
            <div style={{ ...C.card, marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>📅 DÍAS AL GYM ESTA SEMANA</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }}>
                {weekDates.map((fecha, i) => {
                  const fue = gymWeek[fecha]
                  const isToday = fecha === todayISO
                  return (
                    <div key={fecha} onClick={() => toggleGymDay(fecha)} style={{ textAlign: 'center', padding: '10px 4px', borderRadius: 8, border: `1px solid ${isToday ? s.accent : fue ? s.green : s.border}`, background: fue ? 'rgba(60,255,180,.06)' : s.surf2, cursor: 'pointer', transition: 'all .2s' }}>
                      <div style={{ fontSize: 9, color: isToday ? s.accent : s.muted, letterSpacing: 1, marginBottom: 4 }}>{DAYS_SHORT[i]}</div>
                      <div style={{ fontSize: 18 }}>{fue ? '✅' : '⬜'}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Resumen del día */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div style={C.card}>
                <div style={{ fontSize: 10, color: s.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>💧 Agua hoy</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <button onClick={() => addAgua(-0.25)} style={{ ...C.btn, background: s.surf2, border: `1px solid ${s.border}`, color: s.text, padding: '6px 12px' }}>−</button>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: aguaL >= 3 ? s.green : s.blue }}>{aguaL.toFixed(1)}L</div>
                    <div style={{ fontSize: 10, color: s.muted }}>/ 3L objetivo</div>
                  </div>
                  <button onClick={() => addAgua(0.25)} style={{ ...C.btn, background: s.blue, color: '#fff', padding: '6px 12px' }}>+</button>
                </div>
                <div style={{ height: 6, background: s.border2, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: Math.min(aguaL / 3 * 100, 100) + '%', background: aguaL >= 3 ? s.green : s.blue, borderRadius: 3, transition: 'width .3s' }} />
                </div>
                <div style={{ fontSize: 11, color: aguaSt.color, marginTop: 8, textAlign: 'center', fontWeight: 600 }}>{aguaSt.label}</div>
              </div>

              <div style={C.card}>
                <div style={{ fontSize: 10, color: s.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>💊 Suplementos hoy</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: supsHoy === SUPLEMENTOS_LIST.length ? s.green : s.accent, marginBottom: 8 }}>{supsHoy}/{SUPLEMENTOS_LIST.length}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SUPLEMENTOS_LIST.map(sup => (
                    <div key={sup.id} onClick={() => toggleSuplemento(sup.id)} style={{ fontSize: 20, cursor: 'pointer', opacity: suplementos[sup.id] ? 1 : 0.25, transition: 'opacity .2s' }} title={sup.nombre}>{sup.emoji}</div>
                  ))}
                </div>
              </div>

              <div style={C.card}>
                <div style={{ fontSize: 10, color: s.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>🥗 Calorías hoy</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.accent }}>{totalCals} <span style={{ fontSize: 14, color: s.muted }}>kcal</span></div>
                <div style={{ fontSize: 11, color: s.muted, marginBottom: 8 }}>Proteína: {totalProt}g / 148g</div>
                <div style={{ height: 5, background: s.border2, borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', width: Math.min(totalCals / 2850 * 100, 100) + '%', background: s.accent, borderRadius: 3 }} />
                </div>
                <div style={{ height: 4, background: s.border2, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: Math.min(totalProt / 148 * 100, 100) + '%', background: s.blue, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ RUTINA ════ */}
        {page === 'rutina' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Rutina Semanal</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>HIPERTROFIA · JEFF NIPPARD STYLE · 6 DÍAS · 8 EJERCICIOS</div>
            </div>

            {/* Tabs días */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {DAYS.map((d, i) => {
                const rc = ROUTINES[d]
                return (
                  <div key={d} onClick={() => setCurrentDay(d)} style={{ padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', background: currentDay === d ? `${rc.color}18` : s.surf, border: `1px solid ${currentDay === d ? rc.color : s.border}`, color: currentDay === d ? rc.color : '#666', transition: 'all .15s' }}>
                    {DAYS_ES[i]}
                  </div>
                )
              })}
            </div>

            {/* Header rutina */}
            <div style={{ ...C.card, marginBottom: 12, background: `linear-gradient(135deg,${r.color}10,transparent)`, border: `1px solid ${r.color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', color: r.color }}>{r.singleMuscle}</div>
                  <div style={{ fontSize: 11, color: s.muted, marginTop: 3, letterSpacing: 2 }}>{r.badge} · {r.exercises.length} ejercicios</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: r.color }}>{pct}%</div>
                  <div style={{ fontSize: 11, color: s.muted }}>{doneCnt}/{r.exercises.length}</div>
                </div>
              </div>
              <div style={{ height: 6, background: s.border2, borderRadius: 3, marginTop: 12, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pct + '%', background: r.color, borderRadius: 3, transition: 'width .4s' }} />
              </div>
            </div>

            {/* Ejercicios */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {r.exercises.map((e, i) => {
                const record = getRecord(e.id)
                const todayKg = getTodayWeight(e.id)
                const isRecord = todayKg && record && Number(todayKg) >= record
                return (
                  <div key={e.id} style={{ ...C.card, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `1px solid ${checks[e.id] ? s.green : s.border}`, background: checks[e.id] ? `rgba(60,255,180,.03)` : s.surf, transition: 'all .15s' }}>
                    <div style={{ fontSize: 12, color: s.muted, width: 20, textAlign: 'center', fontWeight: 700 }}>{i + 1}</div>

                    {/* Check */}
                    <div onClick={() => toggleCheck(e.id)} style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${checks[e.id] ? s.green : s.border2}`, background: checks[e.id] ? s.green : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all .2s' }}>
                      {checks[e.id] && <span style={{ color: '#000', fontSize: 12, fontWeight: 900 }}>✓</span>}
                    </div>

                    {/* Silueta muscular */}
                    <div style={{ width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {MUSCLE_SVG[e.svg] || MUSCLE_SVG.cardio}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: checks[e.id] ? s.muted : s.text, textDecoration: checks[e.id] ? 'line-through' : 'none' }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>{e.detail}</div>
                      <div style={{ fontSize: 10, color: r.color, marginTop: 2, letterSpacing: 1 }}>💪 {e.muscle}</div>
                    </div>

                    {/* Peso + Record */}
                    <div style={{ textAlign: 'right', minWidth: 100 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
                        <input
                          type="number"
                          placeholder="kg"
                          defaultValue={todayKg}
                          onBlur={ev => saveWeight(e.id, ev.target.value)}
                          style={{ ...C.inp, width: 64, textAlign: 'center', padding: '5px 8px', fontSize: 13, border: `1px solid ${isRecord ? s.gold : s.border}` }}
                        />
                        <span style={{ fontSize: 11, color: s.muted }}>kg</span>
                      </div>
                      {record && (
                        <div style={{ fontSize: 10, color: s.gold, fontWeight: 600 }}>
                          {isRecord ? '🏅 NUEVO RÉCORD!' : `🏅 Récord: ${record}kg`}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {pct === 100 && (
              <div style={{ ...C.card, marginTop: 16, background: 'rgba(60,255,180,.08)', border: `1px solid ${s.green}`, textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 28 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: s.green, marginTop: 8 }}>ENTRENAMIENTO COMPLETADO</div>
                <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>Marcá el día de gym si no lo hiciste</div>
                {!gymWeek[todayISO] && (
                  <button onClick={() => toggleGymDay(todayISO)} style={{ ...C.btn, background: s.green, color: '#000', marginTop: 12, padding: '10px 24px' }}>✅ Marcar día de gym</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ HIDRATACIÓN ════ */}
        {page === 'hidratacion' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Hidratación</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>OBJETIVO: 3 LITROS DIARIOS</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {/* Centro */}
              <div style={{ ...C.card, textAlign: 'center', padding: 36 }}>
                <div style={{ fontSize: 56, marginBottom: 8 }}>{aguaSt.emoji}</div>
                <div style={{ fontSize: 64, fontWeight: 900, color: aguaSt.color }}>{aguaL.toFixed(1)}</div>
                <div style={{ fontSize: 14, color: s.muted, marginBottom: 4 }}>litros hoy / 3.0L</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: aguaSt.color, marginBottom: 20 }}>{aguaSt.label}</div>
                <div style={{ height: 12, background: s.border2, borderRadius: 6, overflow: 'hidden', marginBottom: 24 }}>
                  <div style={{ height: '100%', width: Math.min(aguaL / 3 * 100, 100) + '%', background: aguaSt.color, borderRadius: 6, transition: 'width .4s' }} />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => addAgua(-0.25)} style={{ ...C.btn, background: s.surf2, border: `1px solid ${s.border}`, color: s.text, fontSize: 15, padding: '10px 20px' }}>−250ml</button>
                  <button onClick={() => addAgua(0.5)} style={{ ...C.btn, background: s.blue, color: '#fff', fontSize: 15, padding: '10px 20px' }}>+500ml</button>
                  <button onClick={() => addAgua(0.25)} style={{ ...C.btn, background: s.surf2, border: `1px solid ${s.border}`, color: s.text, fontSize: 15, padding: '10px 20px' }}>+250ml</button>
                </div>
              </div>

              {/* Niveles */}
              <div style={C.card}>
                <div style={{ fontSize: 11, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>NIVELES</div>
                {[
                  [s.red,    '😬', '0 – 1 litro',      'Lejos de la meta',  'Rendimiento comprometido. Hidratate urgente.'],
                  [s.orange, '😐', '1 – 2 litros',      'Regular',           'Básico cubierto. Podés mejorar.'],
                  [s.gold,   '🧠', '2 – 2.5 litros',    'Casi un genio',     'Bien hidratado. Seguí así.'],
                  [s.green,  '🏆', '3+ litros',          '¡Lo lograste!',     'Máximo rendimiento. Fuerza +20%.'],
                ].map(([c, em, rng, lbl, desc]) => (
                  <div key={lbl} style={{ display: 'flex', gap: 14, padding: '12px 14px', marginBottom: 8, borderRadius: 8, border: `1px solid ${s.border}`, borderLeft: `4px solid ${c}`, background: aguaSt.color === c ? `${c}10` : s.surf2 }}>
                    <div style={{ fontSize: 22 }}>{em}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 2 }}>{lbl} <span style={{ fontSize: 10, color: s.muted, fontWeight: 400 }}>· {rng}</span></div>
                      <div style={{ fontSize: 11, color: s.muted }}>{desc}</div>
                    </div>
                  </div>
                ))}

                {/* Historial semana */}
                <div style={{ fontSize: 10, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', margin: '16px 0 10px' }}>ESTA SEMANA</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {weekDates.map((fecha, i) => (
                    <div key={fecha} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: s.muted }}>{DAYS_SHORT[i]}</div>
                      <div style={{ height: 40, background: s.border2, borderRadius: 4, marginTop: 4, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: Math.min(100, (gymWeek[fecha] ? 3 : 0) / 3 * 100) + '%', background: s.blue, transition: 'height .3s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ SUPLEMENTOS ════ */}
        {page === 'suplementos' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Suplementos</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>CHECK DIARIO + HISTORIAL SEMANAL · {supsHoy}/{SUPLEMENTOS_LIST.length} HOY</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
              {SUPLEMENTOS_LIST.map(sup => (
                <div key={sup.id} style={{ ...C.card, cursor: 'pointer', border: `1px solid ${suplementos[sup.id] ? sup.color : s.border}`, background: suplementos[sup.id] ? `${sup.color}0d` : s.surf, transition: 'all .2s' }}>
                  <div onClick={() => toggleSuplemento(sup.id)} style={{ textAlign: 'center', padding: '4px 0 12px' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{sup.emoji}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: suplementos[sup.id] ? sup.color : s.text, marginBottom: 2 }}>{sup.nombre}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginBottom: 4 }}>{sup.dosis}</div>
                    <div style={{ fontSize: 10, color: s.muted, marginBottom: 12 }}>{sup.timing}</div>
                    <div style={{ background: suplementos[sup.id] ? sup.color : 'transparent', border: `1px solid ${suplementos[sup.id] ? sup.color : s.border}`, borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: suplementos[sup.id] ? '#000' : s.muted }}>
                      {suplementos[sup.id] ? '✅ Tomado' : '○ Pendiente'}
                    </div>
                  </div>

                  {/* Historial semanal por suplemento */}
                  <div style={{ borderTop: `1px solid ${s.border}`, paddingTop: 10, marginTop: 4 }}>
                    <div style={{ fontSize: 9, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' }}>ESTA SEMANA</div>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      {weekDates.map((fecha, i) => {
                        const taken = suplWeek[`${fecha}-${sup.id}`]
                        return (
                          <div key={fecha} title={DAYS_ES[i]} style={{ width: 18, height: 18, borderRadius: 3, border: `1px solid ${taken ? sup.color : s.border2}`, background: taken ? sup.color : 'transparent', transition: 'all .2s' }} />
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={C.card}>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>💡 STACK RECOMENDADO PARA BULK</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                {SUPLEMENTOS_LIST.map(sup => (
                  <div key={sup.id} style={{ background: s.surf2, border: `1px solid ${s.border}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.text, marginBottom: 4 }}>{sup.emoji} {sup.nombre}</div>
                    <div style={{ fontSize: 11, color: s.muted }}>{sup.dosis} · {sup.timing}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ NUTRICIÓN ════ */}
        {page === 'nutricion' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Nutrición</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>BULK LIMPIO · 2,850 KCAL · 148G PROTEÍNA</div>
            </div>

            {/* Macros */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
              {[['Calorías', totalCals, 2850, 'kcal', s.accent], ['Proteína', totalProt, 148, 'g', s.blue], ['Carbos', totalCarbs, 320, 'g', s.green], ['Grasas', totalFats, 80, 'g', s.gold]].map(([l, v, obj, u, c]) => (
                <div key={l} style={C.card}>
                  <div style={{ fontSize: 9, color: s.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: c }}>{v}<span style={{ fontSize: 12, color: s.muted }}>{u}</span></div>
                  <div style={{ fontSize: 10, color: s.muted, marginBottom: 6 }}>/ {obj}{u}</div>
                  <div style={{ height: 4, background: s.border2, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: Math.min(v / obj * 100, 100) + '%', background: c, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* IA foto */}
            <div style={{ ...C.card, marginBottom: 16, border: `1px solid rgba(232,255,60,.2)`, background: 'rgba(232,255,60,.03)' }}>
              <div style={{ fontSize: 10, color: s.accent, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>⚡ ANÁLISIS IA — FOTO DE COMIDA</div>
              <div style={{ fontSize: 12, color: s.muted, marginBottom: 14 }}>Subí una foto de tu comida y la IA calcula calorías, proteína, carbs y grasas automáticamente.</div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={analyzePhoto} />
              <button onClick={() => fileRef.current?.click()} style={{ ...C.btn, background: s.surf2, border: `1px solid ${s.border}`, color: s.text, marginBottom: 12 }}>
                📸 Subir foto de comida
              </button>
              {aiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: s.surf2, borderRadius: 8, color: s.accent, fontSize: 13 }}>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Analizando tu comida...
                </div>
              )}
              {aiResult && (
                <div style={{ background: s.surf2, border: `1px solid ${s.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{aiResult.nombre}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: aiResult.confianza === 'alta' ? 'rgba(60,255,180,.15)' : 'rgba(212,168,67,.15)', color: aiResult.confianza === 'alta' ? s.green : s.gold, letterSpacing: 1 }}>
                      {aiResult.confianza?.toUpperCase()} CONFIANZA
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
                    {[['KCAL', aiResult.kcal, s.accent], ['PROT', aiResult.proteina + 'g', s.blue], ['CARBS', aiResult.carbohidratos + 'g', s.green], ['GRASAS', aiResult.grasas + 'g', s.gold]].map(([l, v, c]) => (
                      <div key={l} style={{ textAlign: 'center', padding: '10px 8px', background: s.surf3, borderRadius: 8, border: `1px solid ${s.border}` }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
                        <div style={{ fontSize: 9, color: s.muted, letterSpacing: 2, marginTop: 3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  {aiResult.descripcion && <div style={{ fontSize: 11, color: s.muted, marginBottom: 12 }}>{aiResult.descripcion}</div>}
                  <button onClick={addAiFood} style={{ ...C.btn, background: s.accent, color: '#000', width: '100%' }}>+ Agregar a hoy</button>
                </div>
              )}
            </div>

            {/* Manual */}
            <div style={{ ...C.card, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>+ Agregar alimento manual</div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'flex-end' }}>
                {[['nombre', 'Alimento', 'Ej: Pollo'], ['cals', 'Kcal', '0'], ['proteina', 'Prot g', '0'], ['carbos', 'Carbs g', '0'], ['grasas', 'Grasas g', '0']].map(([k, l, ph]) => (
                  <div key={k}>
                    <div style={{ fontSize: 9, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
                    <input style={C.inp} placeholder={ph} value={foodForm[k]} onChange={e => setFoodForm(p => ({ ...p, [k]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addFood()} />
                  </div>
                ))}
                <button onClick={addFood} style={{ ...C.btn, background: s.accent, color: '#000', height: 38, padding: '0 16px' }}>+</button>
              </div>
            </div>

            {/* Lista comidas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {todayFoods.length === 0 ? <div style={{ color: s.muted, fontSize: 13, padding: 12 }}>Sin alimentos hoy.</div> :
                todayFoods.map(f => (
                  <div key={f.id} style={{ ...C.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, minWidth: 140 }}>{f.nombre}</div>
                    <div style={{ display: 'flex', gap: 14, fontSize: 11, color: s.muted }}>
                      <span>P:<b style={{ color: s.blue }}>{f.proteina}g</b></span>
                      <span>C:<b style={{ color: s.green }}>{f.carbos}g</b></span>
                      <span>G:<b style={{ color: s.gold }}>{f.grasas}g</b></span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.accent }}>{f.cals}kcal</div>
                    <button onClick={() => removeFood(f.id)} style={{ ...C.btn, background: 'rgba(255,60,60,.1)', border: `1px solid rgba(255,60,60,.2)`, color: s.red, padding: '4px 10px', fontSize: 11 }}>✕</button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ════ PROGRESO ════ */}
        {page === 'progreso' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Progreso</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>TODO LO QUE HICISTE · RESUMEN MENSUAL</div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                ['Peso', pesoActual + ' kg', lastMedida ? ((+pesoActual - 73.6) >= 0 ? '+' : '') + ((+pesoActual - 73.6).toFixed(1)) + ' kg desde inicio' : 'Baseline', true],
                ['Músculo', musculoActual + ' kg', lastMedida ? ((+musculoActual - 35.6) >= 0 ? '+' : '') + ((+musculoActual - 35.6).toFixed(1)) + ' kg' : 'Baseline', true],
                ['% Grasa', grasaPct + '%', '≤ 16% objetivo', +grasaPct <= 16],
                ['Días gym total', diasGymTotal + ' días', 'Historial completo', diasGymTotal >= 20],
              ].map(([l, v, d, pos]) => (
                <div key={l} style={C.card}>
                  <div style={{ fontSize: 9, color: s.muted, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{l}</div>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>{v}</div>
                  <div style={{ fontSize: 11, color: pos ? s.green : s.muted, marginTop: 4 }}>{d}</div>
                </div>
              ))}
            </div>

            {/* Días al gym semana */}
            <div style={{ ...C.card, marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>📅 DÍAS AL GYM ESTA SEMANA</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }}>
                {weekDates.map((fecha, i) => {
                  const fue = gymWeek[fecha]
                  const isToday = fecha === todayISO
                  return (
                    <div key={fecha} onClick={() => toggleGymDay(fecha)} style={{ textAlign: 'center', padding: '12px 4px', borderRadius: 8, border: `1px solid ${isToday ? s.accent : fue ? s.green : s.border}`, background: fue ? 'rgba(60,255,180,.06)' : s.surf2, cursor: 'pointer', transition: 'all .2s' }}>
                      <div style={{ fontSize: 9, color: isToday ? s.accent : s.muted, letterSpacing: 1, marginBottom: 6 }}>{DAYS_ES[i]}</div>
                      <div style={{ fontSize: 22 }}>{fue ? '✅' : '⬜'}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Resumen mensual */}
            <div style={{ ...C.card, marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>📊 RESUMEN DEL MES</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                {[
                  ['Días gym', diasGymTotal + ' días', s.green],
                  ['Suplementos hoy', supsHoy + '/' + SUPLEMENTOS_LIST.length, s.accent],
                  ['Agua hoy', aguaL.toFixed(1) + 'L / 3L', s.blue],
                  ['Streak', streak + ' días 🔥', s.purple],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ background: s.surf2, border: `1px solid ${s.border}`, borderRadius: 8, padding: '14px 16px' }}>
                    <div style={{ fontSize: 9, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial medidas */}
            <div style={C.card}>
              <div style={{ fontSize: 10, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>HISTORIAL BODY</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Fecha', 'Peso', 'Músculo', 'Grasa%', 'InBody', 'Delta Músculo'].map(h => (
                    <th key={h} style={{ fontSize: 9, color: s.muted, textAlign: 'left', padding: '6px 10px', borderBottom: `1px solid ${s.border}`, letterSpacing: 2 }}>{h.toUpperCase()}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  <tr>
                    {['Mayo 2026', '73.6 kg', '35.6 kg', '15%', '80', '—'].map((v, i) => (
                      <td key={i} style={{ padding: '10px', fontSize: 12, borderBottom: `1px solid ${s.border}`, color: i === 3 ? s.gold : i === 4 ? s.accent : s.text }}>{v}</td>
                    ))}
                  </tr>
                  {medidas.map((m, idx) => {
                    const prev = medidas[idx + 1]
                    const delta = prev ? ((m.musculo - prev.musculo) >= 0 ? '+' : '') + (m.musculo - prev.musculo).toFixed(1) + 'kg' : '—'
                    return (
                      <tr key={m.id}>
                        {[m.fecha, m.peso + 'kg', m.musculo + 'kg', m.grasa_pct + '%', m.inbody || '—', delta].map((v, i) => (
                          <td key={i} style={{ padding: '10px', fontSize: 12, borderBottom: `1px solid ${s.border}`, color: i === 3 ? s.gold : i === 4 ? s.accent : i === 5 ? (delta.startsWith('+') ? s.green : s.red) : s.text }}>{v}</td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ MOTIVACIÓN ════ */}
        {page === 'motivacion' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Motivación</div>
              <div style={{ fontSize: 12, color: s.muted, marginTop: 4 }}>FRASES · CIENCIA DEL MÚSCULO · TU META</div>
            </div>

            {/* Frase grande rotativa */}
            <div style={{ background: `linear-gradient(135deg,rgba(232,255,60,.07),rgba(60,255,180,.04))`, border: `1px solid rgba(232,255,60,.2)`, borderRadius: 14, padding: '28px 32px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: s.muted, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>💬 FRASE DEL DÍA</div>
              <div style={{ fontSize: 20, color: s.text, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.6, marginBottom: 12, maxWidth: 600, margin: '0 auto 12px' }}>
                "{FRASES_MOTIVACION[motivFraseIdx].text}"
              </div>
              <div style={{ fontSize: 12, color: s.muted, marginBottom: 20 }}>{FRASES_MOTIVACION[motivFraseIdx].src}</div>
              <button onClick={() => setMotivFraseIdx(i => (i + 1) % FRASES_MOTIVACION.length)} style={{ ...C.btn, background: 'transparent', border: `1px solid ${s.border}`, color: s.muted, fontSize: 12 }}>↻ Siguiente frase</button>
            </div>

            {/* Datos científicos */}
            <div style={{ fontSize: 11, color: s.muted, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>📊 CIENCIA DEL BULK — DATOS REALES</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {DATOS_BULK.map(d => (
                <div key={d.titulo} style={{ ...C.card, borderLeft: `3px solid ${s.accent}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: s.accent, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{d.titulo}</div>
                  <div style={{ fontSize: 13, color: s.text, lineHeight: 1.6, marginBottom: 6 }}>{d.dato}</div>
                  <div style={{ fontSize: 10, color: s.muted }}>Fuente: {d.fuente}</div>
                </div>
              ))}
            </div>

            {/* Tu meta */}
            <div style={{ ...C.card, background: 'linear-gradient(135deg,rgba(60,255,180,.05),rgba(232,255,60,.03))', border: `1px solid rgba(60,255,180,.15)` }}>
              <div style={{ fontSize: 11, color: s.green, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>🎯 TU META — BULK 2026</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {[
                  ['Músculo meta', '+3-4 kg', s.green, musculoActual + ' kg actual', '→ 38-39 kg'],
                  ['Grasa máx', '≤ 16%', s.gold, grasaPct + '% actual', grasaPct <= 16 ? '✅ En objetivo' : '⚠️ Monitorear'],
                  ['Peso meta', '77-78 kg', s.blue, pesoActual + ' kg actual', '+' + (77 - pesoActual).toFixed(1) + ' kg por ganar'],
                ].map(([l, v, c, cur, note]) => (
                  <div key={l} style={{ background: s.surf2, border: `1px solid ${s.border}`, borderRadius: 10, padding: 18, textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{l}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: c, marginBottom: 4 }}>{v}</div>
                    <div style={{ fontSize: 11, color: s.muted, marginBottom: 4 }}>{cur}</div>
                    <div style={{ fontSize: 11, color: c }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ MEDIDAS ════ */}
        {page === 'medidas' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>Medidas Corporales</div>
            </div>
            <div style={{ ...C.card, marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>📋 Nueva medición</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
                {[['peso', 'Peso (kg)', '73.6'], ['musculo', 'Músculo (kg)', '35.6'], ['grasa_kg', 'Grasa (kg)', '11'], ['grasa_pct', '% Grasa', '15'], ['cintura', 'Cintura (cm)', ''], ['bicep', 'Bícep D (cm)', ''], ['inbody', 'InBody Score', '80'], ['notas', 'Notas', '']].map(([k, l, ph]) => (
                  <div key={k}>
                    <div style={{ fontSize: 9, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{l}</div>
                    <input style={C.inp} placeholder={ph} value={medForm[k]} onChange={e => setMedForm(p => ({ ...p, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <button onClick={saveMedida} style={{ ...C.btn, background: s.accent, color: '#000' }}>💾 Guardar medición</button>
            </div>

            {medidas.length > 0 && (
              <div style={C.card}>
                <div style={{ fontSize: 10, color: s.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>HISTORIAL</div>
                {medidas.slice(0, 5).map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${s.border}`, fontSize: 12 }}>
                    <span style={{ color: s.muted }}>{m.fecha}</span>
                    <span>{m.peso}kg</span>
                    <span style={{ color: s.green }}>{m.musculo}kg músculo</span>
                    <span style={{ color: s.gold }}>{m.grasa_pct}% grasa</span>
                    <span style={{ color: s.accent }}>InBody: {m.inbody || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: s.accent, color: '#000', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, zIndex: 300, boxShadow: '0 4px 20px rgba(0,0,0,.5)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
