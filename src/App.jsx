import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const FRASES = [
  "El dolor de hoy es la fuerza de mañana.",
  "No pares cuando estés cansado. Para cuando hayas terminado.",
  "Tu cuerpo puede hacerlo. Es tu mente la que tenés que convencer.",
  "Cada rep te acerca más a quien querés ser.",
  "Disciplina es elegir lo que querés más sobre lo que querés ahora.",
  "Los campeones no se hacen en el gym. Se revelan ahí.",
  "Levantate, trabajá duro, sé disciplinado. Repetí.",
]

const SUPLEMENTOS_LIST = [
  {id:'creatina', nombre:'Creatina', dosis:'5g', emoji:'⚡', color:'#e8ff3c'},
  {id:'proteina', nombre:'Proteína', dosis:'30g', emoji:'💪', color:'#3cffb4'},
  {id:'vitamina_c', nombre:'Vitamina C', dosis:'1000mg', emoji:'🍊', color:'#ff9f3c'},
  {id:'omega3', nombre:'Omega 3', dosis:'2 caps', emoji:'🐟', color:'#3c9fff'},
  {id:'vitamina_d', nombre:'Vitamina D', dosis:'2000IU', emoji:'☀️', color:'#ffd93c'},
  {id:'magnesio', nombre:'Magnesio', dosis:'400mg', emoji:'🌙', color:'#c47fff'},
]

const AGUA_OBJETIVO = 8 // vasos

const ROUTINES = {
  lunes:{title:'Pecho + Tríceps',badge:'PUSH',color:'#e8ff3c',exercises:[
    {id:'e1',name:'Press de banca plano',detail:'4 × 8-10 reps · 60-70% 1RM'},
    {id:'e2',name:'Press inclinado mancuernas',detail:'4 × 10-12 reps'},
    {id:'e3',name:'Aperturas en polea baja',detail:'3 × 12-15 reps'},
    {id:'e4',name:'Fondos en paralelas',detail:'3 × 10-12 reps'},
    {id:'e5',name:'Press francés con barra EZ',detail:'3 × 10-12 reps'},
    {id:'e6',name:'Extensiones tríceps polea',detail:'3 × 12-15 reps'},
  ]},
  martes:{title:'Espalda + Bíceps',badge:'PULL',color:'#3c9fff',exercises:[
    {id:'e7',name:'Dominadas lastre o asistidas',detail:'4 × 6-10 reps'},
    {id:'e8',name:'Remo con barra pronado',detail:'4 × 8-10 reps'},
    {id:'e9',name:'Jalón al pecho agarre neutro',detail:'3 × 10-12 reps'},
    {id:'e10',name:'Remo en polea sentado',detail:'3 × 12 reps'},
    {id:'e11',name:'Curl con barra EZ',detail:'4 × 8-10 reps'},
    {id:'e12',name:'Curl martillo alterno',detail:'3 × 10-12 reps'},
  ]},
  miercoles:{title:'Piernas · Cuádriceps',badge:'LEGS',color:'#ff3c3c',exercises:[
    {id:'e13',name:'Sentadilla libre high bar',detail:'4 × 6-8 reps · pesado'},
    {id:'e14',name:'Prensa de piernas 45°',detail:'4 × 10-12 reps'},
    {id:'e15',name:'Sentadilla hack',detail:'3 × 12 reps'},
    {id:'e16',name:'Extensiones de cuádriceps',detail:'3 × 15 reps'},
    {id:'e17',name:'Curl femoral acostado',detail:'3 × 12 reps'},
    {id:'e18',name:'Pantorrillas de pie',detail:'5 × 15-20 reps'},
  ]},
  jueves:{title:'Hombros + Core',badge:'DELTS',color:'#d4a843',exercises:[
    {id:'e19',name:'Press militar con barra',detail:'4 × 6-8 reps'},
    {id:'e20',name:'Press Arnold mancuernas',detail:'3 × 10-12 reps'},
    {id:'e21',name:'Elevaciones laterales cable',detail:'4 × 15 reps · técnica estricta'},
    {id:'e22',name:'Face pulls polea alta',detail:'4 × 15-20 reps'},
    {id:'e23',name:'Elevaciones frontales disco',detail:'3 × 12 reps'},
    {id:'e24',name:'Plancha frontal + lateral',detail:'3 × 45-60 seg c/u'},
  ]},
  viernes:{title:'Espalda baja + Isquios',badge:'PULL 2',color:'#3cffb4',exercises:[
    {id:'e25',name:'Peso muerto convencional',detail:'5 × 4-6 reps · 80-85% 1RM'},
    {id:'e26',name:'Buenos días con barra',detail:'3 × 10-12 reps'},
    {id:'e27',name:'Peso muerto rumano',detail:'3 × 10-12 reps'},
    {id:'e28',name:'Curl femoral sentado',detail:'4 × 10-12 reps'},
    {id:'e29',name:'Hiperextensiones',detail:'3 × 15 reps'},
  ]},
  sabado:{title:'Pecho + Hombros Vol.',badge:'PUSH 2',color:'#c47fff',exercises:[
    {id:'e30',name:'Press inclinado barra',detail:'4 × 8-10 reps'},
    {id:'e31',name:'Aperturas mancuernas plano',detail:'3 × 12 reps'},
    {id:'e32',name:'Cruces en polea',detail:'3 × 15 reps'},
    {id:'e33',name:'Elevaciones laterales mancuerna',detail:'5 × 15 reps · descanso 45s'},
    {id:'e34',name:'Press trasnuca Smith',detail:'3 × 12 reps'},
  ]},
  domingo:{title:'Descanso Activo',badge:'REST',color:'#555',exercises:[
    {id:'e35',name:'Caminata 30-45 minutos',detail:'Ritmo moderado, al aire libre'},
    {id:'e36',name:'Stretching full body',detail:'15-20 minutos'},
    {id:'e37',name:'Foam rolling',detail:'10 minutos grupos trabajados'},
    {id:'e38',name:'Visualización y meal prep',detail:'Preparar la semana'},
  ]},
}

const DAYS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
const DAYS_ES = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

const s = {
  bg:'#080808',surf:'#101010',surf2:'#141414',surf3:'#1a1a1a',
  border:'#1e1e1e',border2:'#282828',
  text:'#f0f0f0',muted:'#444',muted2:'#666',
  accent:'#e8ff3c',green:'#3cffb4',red:'#ff3c3c',blue:'#3c9fff',gold:'#d4a843',purple:'#c47fff'
}

const C = {
  sidebar:{position:'fixed',left:0,top:0,bottom:0,width:230,background:s.surf,borderRight:`1px solid ${s.border}`,display:'flex',flexDirection:'column',zIndex:100,fontFamily:'system-ui,sans-serif'},
  main:{marginLeft:230,padding:'32px 40px',minHeight:'100vh',fontFamily:'system-ui,sans-serif',background:s.bg,color:s.text,width:'calc(100vw - 230px)',maxWidth:'calc(100vw - 230px)',overflowX:'hidden'},
  navItem:(active)=>({display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:500,color:active?s.accent:'#666',background:active?'rgba(232,255,60,.08)':'transparent',border:active?`1px solid rgba(232,255,60,.12)`:'1px solid transparent',marginBottom:2,transition:'all .15s'}),
  card:{background:s.surf,border:`1px solid ${s.border}`,borderRadius:12,padding:20},
  inp:{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:8,padding:'9px 12px',color:s.text,fontFamily:'system-ui,sans-serif',fontSize:13,outline:'none',width:'100%'},
  btn:{fontWeight:700,padding:'9px 16px',borderRadius:8,border:'none',cursor:'pointer',fontSize:13,transition:'all .15s'},
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const todayIdx = new Date().getDay()===0?6:new Date().getDay()-1
  const [currentDay, setCurrentDay] = useState(DAYS[todayIdx])
  const [checks, setChecks] = useState({})
  const [foods, setFoods] = useState([])
  const [medidas, setMedidas] = useState([])
  const [agua, setAgua] = useState(0)
  const [suplementos, setSuplementos] = useState({})
  const [asistencia, setAsistencia] = useState([])
  const [foodForm, setFoodForm] = useState({nombre:'',cals:'',proteina:'',carbos:'',grasas:''})
  const [medForm, setMedForm] = useState({peso:'',musculo:'',grasa_kg:'',grasa_pct:'',cintura:'',bicep:'',inbody:'',notas:''})
  const [toast, setToast] = useState('')
  const [frase] = useState(FRASES[Math.floor(Math.random()*FRASES.length)])

  const today = new Date().toDateString()
  const fechaHoy = new Date().toLocaleDateString('es-ES')

  useEffect(()=>{ loadAll() },[])

  async function loadAll() {
    const [c,f,m,a,sup,asist] = await Promise.all([
      supabase.from('gym_checks').select('*').eq('fecha',today),
      supabase.from('gym_foods').select('*').eq('fecha',today),
      supabase.from('gym_medidas').select('*').order('created_at',{ascending:false}),
      supabase.from('gym_agua').select('*').eq('fecha',today).single(),
      supabase.from('gym_suplementos').select('*').eq('fecha',today).single(),
      supabase.from('gym_asistencia').select('*').order('created_at',{ascending:false}).limit(30),
    ])
    if(c.data){const ch={};c.data.forEach(x=>ch[x.exercise_id]=x.done);setChecks(ch)}
    if(f.data) setFoods(f.data)
    if(m.data) setMedidas(m.data)
    if(a.data) setAgua(a.data.vasos||0)
    if(sup.data) setSuplementos(sup.data)
    if(asist.data) setAsistencia(asist.data)
  }

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),2500)}

  async function addAgua(delta) {
    const nuevo = Math.max(0, Math.min(20, agua+delta))
    setAgua(nuevo)
    const existing = await supabase.from('gym_agua').select('id').eq('fecha',today).single()
    if(existing.data) await supabase.from('gym_agua').update({vasos:nuevo}).eq('id',existing.data.id)
    else await supabase.from('gym_agua').insert({fecha:today,vasos:nuevo})
    if(nuevo===AGUA_OBJETIVO) showToast('🎉 Meta de agua alcanzada!')
  }

  async function toggleSuplemento(id) {
    const nuevo = {...suplementos,[id]:!suplementos[id]}
    setSuplementos(nuevo)
    const existing = await supabase.from('gym_suplementos').select('id').eq('fecha',today).single()
    if(existing.data) await supabase.from('gym_suplementos').update({[id]:nuevo[id]}).eq('id',existing.data.id)
    else await supabase.from('gym_suplementos').insert({fecha:today,[id]:nuevo[id]})
    if(nuevo[id]) showToast('✅ '+SUPLEMENTOS_LIST.find(s=>s.id===id)?.nombre+' tomado!')
  }

  async function marcarAsistencia() {
    const yaFue = asistencia.find(a=>a.fecha===today)
    if(yaFue) return showToast('Ya marcaste asistencia hoy!')
    const {data} = await supabase.from('gym_asistencia').insert({fecha:today,fue:true}).select().single()
    if(data){setAsistencia(prev=>[data,...prev]);showToast('🏋️ Asistencia registrada!')}
  }

  async function toggleCheck(id) {
    const done = !checks[id]
    setChecks(prev=>({...prev,[id]:done}))
    const existing = await supabase.from('gym_checks').select('id').eq('fecha',today).eq('exercise_id',id).single()
    if(existing.data) await supabase.from('gym_checks').update({done}).eq('id',existing.data.id)
    else await supabase.from('gym_checks').insert({fecha:today,exercise_id:id,done})
  }

  async function addFood() {
    if(!foodForm.nombre) return
    const f={...foodForm,fecha:today,cals:+foodForm.cals||0,proteina:+foodForm.proteina||0,carbos:+foodForm.carbos||0,grasas:+foodForm.grasas||0}
    const {data} = await supabase.from('gym_foods').insert(f).select().single()
    if(data){setFoods(prev=>[...prev,data]);setFoodForm({nombre:'',cals:'',proteina:'',carbos:'',grasas:''});showToast('✅ '+f.nombre+' agregado')}
  }

  async function removeFood(id){
    await supabase.from('gym_foods').delete().eq('id',id)
    setFoods(prev=>prev.filter(f=>f.id!==id))
  }

  async function saveMedida() {
    if(!medForm.peso){showToast('⚠️ Ingresá el peso');return}
    const m={...medForm,fecha:fechaHoy,peso:+medForm.peso,musculo:+medForm.musculo||0,grasa_kg:+medForm.grasa_kg||0,grasa_pct:+medForm.grasa_pct||0,cintura:+medForm.cintura||0,bicep:+medForm.bicep||0,inbody:+medForm.inbody||0}
    const {data} = await supabase.from('gym_medidas').insert(m).select().single()
    if(data){setMedidas(prev=>[data,...prev]);setMedForm({peso:'',musculo:'',grasa_kg:'',grasa_pct:'',cintura:'',bicep:'',inbody:'',notas:''});showToast('💾 Medición guardada')}
  }

  const todayFoods = foods.filter(f=>f.fecha===today)
  const totalCals = todayFoods.reduce((a,f)=>a+(+f.cals||0),0)
  const totalProt = todayFoods.reduce((a,f)=>a+(+f.proteina||0),0)
  const totalCarbs = todayFoods.reduce((a,f)=>a+(+f.carbos||0),0)
  const totalFats = todayFoods.reduce((a,f)=>a+(+f.grasas||0),0)

  const r = ROUTINES[currentDay]
  const doneCnt = r.exercises.filter(e=>checks[e.id]).length
  const pct = Math.round(doneCnt/r.exercises.length*100)

  const lastMedida = medidas[0]
  const pesoActual = lastMedida?.peso||73.6
  const musculoActual = lastMedida?.musculo||35.6
  const grasaPct = lastMedida?.grasa_pct||15

  const diasGym = asistencia.filter(a=>a.fue).length
  const supsHoy = SUPLEMENTOS_LIST.filter(s=>suplementos[s.id]).length
  const yaFueHoy = asistencia.find(a=>a.fecha===today)

  // Streak
  let streak = 0
  const sortedAsist = [...asistencia].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha))
  for(let i=0;i<sortedAsist.length;i++){
    const d = new Date(); d.setDate(d.getDate()-i)
    if(sortedAsist[i]?.fecha===d.toDateString()) streak++
    else break
  }

  const pages = [
    ['⚡','dashboard','Dashboard'],
    ['🏋️','rutina','Rutina'],
    ['💧','hidratacion','Hidratación'],
    ['💊','suplementos','Suplementos'],
    ['🥗','nutricion','Nutrición'],
    ['📈','progreso','Progreso'],
    ['📏','medidas','Medidas'],
  ]

  return (
    <div style={{display:'flex'}}>
      {/* SIDEBAR */}
      <div style={C.sidebar}>
        <div style={{padding:'20px 18px 14px',borderBottom:`1px solid ${s.border}`}}>
          <div style={{fontSize:11,color:s.muted,letterSpacing:3,textTransform:'uppercase',marginBottom:2}}>FASE ACTUAL</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{background:'rgba(232,255,60,.15)',border:'1px solid rgba(232,255,60,.3)',borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:700,color:s.accent,letterSpacing:1}}>🔥 VOLUMEN</div>
          </div>
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

        <div style={{padding:'12px 14px',borderTop:`1px solid ${s.border}`}}>
          <div style={{fontSize:10,color:s.muted,fontStyle:'italic',lineHeight:1.4,textAlign:'center'}}>"{frase}"</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={C.main}>

        {/* DASHBOARD */}
        {page==='dashboard' && (
          <div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Panel General</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>BULK · {new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}</div>
            </div>

            {/* Frase motivadora */}
            <div style={{background:`linear-gradient(135deg,rgba(232,255,60,.06),rgba(60,255,180,.03))`,border:`1px solid rgba(232,255,60,.15)`,borderRadius:12,padding:'16px 20px',marginBottom:20,display:'flex',alignItems:'center',gap:14}}>
              <div style={{fontSize:24}}>💬</div>
              <div style={{fontSize:14,color:s.text,fontStyle:'italic',fontWeight:500}}>"{frase}"</div>
            </div>

            {/* Stats rápidos */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:20}}>
              {[
                ['Peso',pesoActual+' kg',s.text,30,'→ 78 kg'],
                ['Músculo',musculoActual+' kg',s.green,40,'→ 38 kg'],
                ['Grasa','15%',s.gold,65,'≤ 16%'],
                ['Gym este mes',diasGym+' días',s.accent,Math.min(diasGym/24*100,100),'Meta: 24/mes'],
                ['Streak',streak+' días 🔥',s.purple,Math.min(streak/30*100,100),'Racha actual'],
              ].map(([l,v,c,p,m])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:9,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:900,color:c}}>{v}</div>
                  <div style={{fontSize:10,color:s.muted,marginTop:3}}>{m}</div>
                  <div style={{height:4,background:s.border2,borderRadius:2,marginTop:8,overflow:'hidden'}}><div style={{height:'100%',width:p+'%',background:c,borderRadius:2,transition:'width .5s'}}/></div>
                </div>
              ))}
            </div>

            {/* Hoy */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:20}}>
              {/* Agua hoy */}
              <div style={C.card}>
                <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>💧 Agua hoy</div>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <button onClick={()=>addAgua(-1)} style={{...C.btn,background:s.surf2,border:`1px solid ${s.border}`,color:s.text,padding:'6px 12px'}}>−</button>
                  <div style={{flex:1,textAlign:'center'}}>
                    <div style={{fontSize:28,fontWeight:900,color:agua>=AGUA_OBJETIVO?s.green:s.blue}}>{agua}</div>
                    <div style={{fontSize:10,color:s.muted}}>/ {AGUA_OBJETIVO} vasos</div>
                  </div>
                  <button onClick={()=>addAgua(1)} style={{...C.btn,background:s.blue,color:'#fff',padding:'6px 12px'}}>+</button>
                </div>
                <div style={{height:6,background:s.border2,borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(agua/AGUA_OBJETIVO*100,100)+'%',background:agua>=AGUA_OBJETIVO?s.green:s.blue,borderRadius:3,transition:'width .3s'}}/></div>
                <div style={{fontSize:10,color:s.muted,marginTop:6,textAlign:'center'}}>{agua>=AGUA_OBJETIVO?'✅ Meta cumplida!':AGUA_OBJETIVO-agua+' vasos restantes'}</div>
              </div>

              {/* Suplementos hoy */}
              <div style={C.card}>
                <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>💊 Suplementos hoy</div>
                <div style={{fontSize:28,fontWeight:900,color:supsHoy===SUPLEMENTOS_LIST.length?s.green:s.accent,marginBottom:4}}>{supsHoy}/{SUPLEMENTOS_LIST.length}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {SUPLEMENTOS_LIST.map(sup=>(
                    <div key={sup.id} onClick={()=>toggleSuplemento(sup.id)} style={{fontSize:16,cursor:'pointer',opacity:suplementos[sup.id]?1:0.3,transition:'opacity .2s'}} title={sup.nombre}>{sup.emoji}</div>
                  ))}
                </div>
              </div>

              {/* Gym hoy */}
              <div style={C.card}>
                <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:10}}>🏋️ Asistencia</div>
                <div style={{fontSize:28,fontWeight:900,color:yaFueHoy?s.green:s.muted,marginBottom:8}}>{yaFueHoy?'✅ Fuiste!':'❌ Sin marcar'}</div>
                {!yaFueHoy && <button onClick={marcarAsistencia} style={{...C.btn,background:s.green,color:'#000',padding:'8px 14px',fontSize:12,width:'100%'}}>Marcar asistencia</button>}
                <div style={{fontSize:10,color:s.muted,marginTop:8}}>Este mes: {diasGym} días</div>
              </div>
            </div>

            {/* Rutina y calorías */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div style={C.card}>
                <div style={{fontSize:11,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:10}}>Rutina de hoy — {ROUTINES[DAYS[todayIdx]].title}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <div style={{fontSize:12,color:s.muted}}>{doneCnt}/{ROUTINES[DAYS[todayIdx]].exercises.length} ejercicios</div>
                  <div style={{fontSize:18,fontWeight:900,color:s.green}}>{pct}%</div>
                </div>
                <div style={{height:8,background:s.border2,borderRadius:4,overflow:'hidden'}}><div style={{height:'100%',width:pct+'%',background:s.green,borderRadius:4,transition:'width .4s'}}/></div>
                <button onClick={()=>setPage('rutina')} style={{...C.btn,background:'transparent',border:`1px solid ${s.border}`,color:s.muted,marginTop:12,width:'100%',fontSize:12}}>Ver rutina →</button>
              </div>
              <div style={C.card}>
                <div style={{fontSize:11,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:10}}>Calorías hoy</div>
                <div style={{fontSize:28,fontWeight:900,color:s.accent}}>{totalCals} <span style={{fontSize:14,color:s.muted}}>kcal</span></div>
                <div style={{fontSize:11,color:s.muted,marginBottom:8}}>Proteína: {totalProt}g / 148g</div>
                <div style={{height:6,background:s.border2,borderRadius:3,overflow:'hidden',marginBottom:4}}><div style={{height:'100%',width:Math.min(totalCals/2850*100,100)+'%',background:s.accent,borderRadius:3}}/></div>
                <div style={{height:4,background:s.border2,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(totalProt/148*100,100)+'%',background:s.blue,borderRadius:2}}/></div>
                <button onClick={()=>setPage('nutricion')} style={{...C.btn,background:'transparent',border:`1px solid ${s.border}`,color:s.muted,marginTop:12,width:'100%',fontSize:12}}>Registrar comida →</button>
              </div>
            </div>
          </div>
        )}

        {/* RUTINA */}
        {page==='rutina' && (
          <div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Rutina Semanal</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>PROGRAMA DE HIPERTROFIA · JEFF NIPPARD STYLE · 6 DÍAS</div>
            </div>
            <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
              {DAYS.map((d,i)=>{
                const rc = ROUTINES[d]
                return <div key={d} onClick={()=>setCurrentDay(d)} style={{padding:'7px 14px',borderRadius:6,cursor:'pointer',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',background:currentDay===d?`rgba(${rc.color==='#e8ff3c'?'232,255,60':'60,159,255'},.1)`:s.surf,border:`1px solid ${currentDay===d?rc.color:s.border}`,color:currentDay===d?rc.color:'#666',transition:'all .15s'}}>{DAYS_ES[i]}</div>
              })}
            </div>
            <div style={{...C.card,marginBottom:12,background:`linear-gradient(135deg,${r.color}10,transparent)`,border:`1px solid ${r.color}30`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontSize:20,fontWeight:900,textTransform:'uppercase',color:r.color}}>{r.title}</div>
                  <div style={{fontSize:11,color:s.muted,marginTop:3,letterSpacing:2}}>{r.badge} · {r.exercises.length} ejercicios</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:24,fontWeight:900,color:r.color}}>{pct}%</div>
                  <div style={{fontSize:11,color:s.muted}}>{doneCnt}/{r.exercises.length}</div>
                </div>
              </div>
              <div style={{height:6,background:s.border2,borderRadius:3,marginTop:12,overflow:'hidden'}}><div style={{height:'100%',width:pct+'%',background:r.color,borderRadius:3,transition:'width .4s'}}/></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {r.exercises.map((e,i)=>(
                <div key={e.id} onClick={()=>toggleCheck(e.id)} style={{...C.card,display:'flex',alignItems:'center',gap:14,cursor:'pointer',background:checks[e.id]?`rgba(60,255,180,.04)`:s.surf,border:`1px solid ${checks[e.id]?s.green:s.border}`,transition:'all .15s',padding:'14px 18px'}}>
                  <div style={{fontSize:12,color:s.muted,width:20,textAlign:'center',fontWeight:700}}>{i+1}</div>
                  <div style={{width:24,height:24,borderRadius:'50%',border:`2px solid ${checks[e.id]?s.green:s.border2}`,background:checks[e.id]?s.green:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .2s'}}>
                    {checks[e.id]&&<span style={{color:'#000',fontSize:12,fontWeight:900}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:checks[e.id]?s.muted:s.text,textDecoration:checks[e.id]?'line-through':'none'}}>{e.name}</div>
                    <div style={{fontSize:11,color:s.muted,marginTop:2}}>{e.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            {pct===100 && (
              <div style={{...C.card,marginTop:16,background:'rgba(60,255,180,.08)',border:`1px solid ${s.green}`,textAlign:'center',padding:20}}>
                <div style={{fontSize:24}}>🎉</div>
                <div style={{fontSize:16,fontWeight:900,color:s.green,marginTop:8}}>ENTRENAMIENTO COMPLETADO</div>
                <div style={{fontSize:12,color:s.muted,marginTop:4}}>Marcá tu asistencia si no lo hiciste!</div>
                {!yaFueHoy && <button onClick={marcarAsistencia} style={{...C.btn,background:s.green,color:'#000',marginTop:12,padding:'10px 20px'}}>✅ Marcar asistencia</button>}
              </div>
            )}
          </div>
        )}

        {/* HIDRATACION */}
        {page==='hidratacion' && (
          <div>
            <div style={{marginBottom:24}}><div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Hidratación</div><div style={{fontSize:12,color:s.muted,marginTop:4}}>OBJETIVO: 8 VASOS · 2L DE AGUA POR DÍA</div></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              <div style={{...C.card,textAlign:'center',padding:32}}>
                <div style={{fontSize:60,marginBottom:8}}>💧</div>
                <div style={{fontSize:56,fontWeight:900,color:agua>=AGUA_OBJETIVO?s.green:s.blue}}>{agua}</div>
                <div style={{fontSize:14,color:s.muted,marginBottom:20}}>vasos tomados hoy / {AGUA_OBJETIVO}</div>
                <div style={{height:12,background:s.border2,borderRadius:6,overflow:'hidden',marginBottom:20}}><div style={{height:'100%',width:Math.min(agua/AGUA_OBJETIVO*100,100)+'%',background:agua>=AGUA_OBJETIVO?s.green:s.blue,borderRadius:6,transition:'width .3s'}}/></div>
                <div style={{display:'flex',gap:10,justifyContent:'center'}}>
                  <button onClick={()=>addAgua(-1)} style={{...C.btn,background:s.surf2,border:`1px solid ${s.border}`,color:s.text,fontSize:20,padding:'12px 24px'}}>−</button>
                  <button onClick={()=>addAgua(1)} style={{...C.btn,background:s.blue,color:'#fff',fontSize:20,padding:'12px 24px'}}>+</button>
                </div>
                {agua>=AGUA_OBJETIVO && <div style={{marginTop:16,color:s.green,fontWeight:700,fontSize:14}}>🎉 Meta cumplida!</div>}
              </div>
              <div style={C.card}>
                <div style={{fontSize:11,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:16}}>Por qué importa</div>
                {[['💪','Rendimiento','+20% de fuerza con buena hidratación'],['🧠','Concentración','El cerebro es 75% agua'],['🔥','Metabolismo','Acelera el queme de grasa'],['💊','Suplementos','La creatina necesita agua para funcionar'],['😴','Recuperación','Mejora el sueño y la síntesis proteica']].map(([e,t,d])=>(
                  <div key={t} style={{display:'flex',gap:12,marginBottom:12,alignItems:'flex-start'}}>
                    <div style={{fontSize:18}}>{e}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:s.text}}>{t}</div>
                      <div style={{fontSize:11,color:s.muted}}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUPLEMENTOS */}
        {page==='suplementos' && (
          <div>
            <div style={{marginBottom:24}}><div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Suplementos</div><div style={{fontSize:12,color:s.muted,marginTop:4}}>CHECK DIARIO · {supsHoy}/{SUPLEMENTOS_LIST.length} TOMADOS HOY</div></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
              {SUPLEMENTOS_LIST.map(sup=>(
                <div key={sup.id} onClick={()=>toggleSuplemento(sup.id)} style={{...C.card,cursor:'pointer',background:suplementos[sup.id]?`rgba(${sup.color==='#e8ff3c'?'232,255,60':sup.color==='#3cffb4'?'60,255,180':'60,159,255'},.06)`:s.surf,border:`1px solid ${suplementos[sup.id]?sup.color:s.border}`,transition:'all .2s',textAlign:'center',padding:24}}>
                  <div style={{fontSize:36,marginBottom:8}}>{sup.emoji}</div>
                  <div style={{fontSize:15,fontWeight:800,color:suplementos[sup.id]?sup.color:s.text,marginBottom:4}}>{sup.nombre}</div>
                  <div style={{fontSize:11,color:s.muted,marginBottom:12}}>{sup.dosis}</div>
                  <div style={{background:suplementos[sup.id]?sup.color:'transparent',border:`1px solid ${suplementos[sup.id]?sup.color:s.border}`,borderRadius:6,padding:'6px 12px',fontSize:12,fontWeight:700,color:suplementos[sup.id]?'#000':s.muted,transition:'all .2s'}}>
                    {suplementos[sup.id]?'✅ Tomado':'○ Pendiente'}
                  </div>
                </div>
              ))}
            </div>
            <div style={C.card}>
              <div style={{fontSize:11,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>💡 Stack recomendado para Bulk</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
                {[['⚡ Creatina','Tomar todos los días, misma hora. 5g con agua. Aumenta fuerza y volumen muscular.'],['💪 Proteína','Post-entreno o cuando no llegás a 148g de proteína diaria con comida.'],['🍊 Vitamina C','Antioxidante, protege los músculos del daño oxidativo durante el entrenamiento.'],['🐟 Omega 3','Anti-inflamatorio, mejora la recuperación y síntesis proteica. Con las comidas.'],['☀️ Vitamina D','Fundamental para testosterona y absorción de calcio. Tomar con comida grasa.'],['🌙 Magnesio','Antes de dormir. Mejora la calidad del sueño y la recuperación muscular.']].map(([t,d])=>(
                  <div key={t} style={{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:8,padding:14}}>
                    <div style={{fontSize:13,fontWeight:700,color:s.text,marginBottom:4}}>{t}</div>
                    <div style={{fontSize:11,color:s.muted,lineHeight:1.6}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NUTRICION */}
        {page==='nutricion' && (
          <div>
            <div style={{marginBottom:20}}><div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Nutrición</div><div style={{fontSize:12,color:s.muted,marginTop:4}}>BULK LIMPIO · 2,850 KCAL · 148G PROTEÍNA</div></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
              {[['Calorías',totalCals,2850,'kcal',s.accent],['Proteína',totalProt,148,'g',s.blue],['Carbos',totalCarbs,320,'g',s.green],['Grasas',totalFats,80,'g',s.gold]].map(([l,v,obj,u,c])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:9,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>{l}</div>
                  <div style={{fontSize:24,fontWeight:900,color:c}}>{v}<span style={{fontSize:12,color:s.muted}}>{u}</span></div>
                  <div style={{fontSize:10,color:s.muted,marginBottom:6}}>/ {obj}{u}</div>
                  <div style={{height:4,background:s.border2,borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(v/obj*100,100)+'%',background:c,borderRadius:2}}/></div>
                </div>
              ))}
            </div>
            <div style={{...C.card,marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:10}}>+ Agregar alimento</div>
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
        {page==='progreso' && (
          <div>
            <div style={{marginBottom:24}}><div style={{fontSize:26,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Progreso</div></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
              {[
                ['Peso',pesoActual+' kg',lastMedida?((+pesoActual-73.6)>=0?'+':'')+((+pesoActual-73.6).toFixed(1))+' kg desde inicio':'Baseline',+pesoActual>=73.6],
                ['Músculo',musculoActual+' kg',lastMedida?((+musculoActual-35.6)>=0?'+':'')+((+musculoActual-35.6).toFixed(1))+' kg':'Baseline',true],
                ['% Grasa',grasaPct+'%','≤ 16% objetivo',+grasaPct<=16],
                ['Días gym',diasGym+' días','Este mes',diasGym>=20],
              ].map(([l,v,d,pos])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:9,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>{l}</div>
                  <div style={{fontSize:24,fontWeight:900}}>{v}</div>
                  <div style={{fontSize:11,color:pos?s.green:s.muted,marginTop:4}}>{d}</div>
                </div>
              ))}
            </div>
            <div style={C.card}>
              <div style={{fontSize:10,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>Historial</div>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Fecha','Peso','Músculo','Grasa%','InBody'].map(h=><th key={h} style={{fontSize:9,color:s.muted,textAlign:'left',padding:'6px 10px',borderBottom:`1px solid ${s.border}`,letterSpacing:2,textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
                <tbody>
                  <tr><td style={{padding:'10px',fontSize:12,color:s.muted,borderBottom:`1px solid ${s.border}`}}>Mayo 2026</td><td style={{padding:'10px',fontSize:12,borderBottom:`1px solid ${s.border}`}}>73.6 kg</td><td style={{padding:'10px',fontSize:12,borderBottom:`1px solid ${s.border}`}}>35.6 kg</td><td style={{padding:'10px',fontSize:12,color:s.gold,borderBottom:`1px solid ${s.border}`}}>15%</td><td style={{padding:'10px',fontSize:12,color:s.accent,borderBottom:`1px solid ${s.border}`}}>80</td></tr>
                  {medidas.map(m=>(
                    <tr key={m.id}><td style={{padding:'10px',fontSize:12,color:s.muted,borderBottom:`1px solid ${s.border}`}}>{m.fecha}</td><td style={{padding:'10px',fontSize:12,borderBottom:`1px solid ${s.border}`}}>{m.peso}kg</td><td style={{padding:'10px',fontSize:12,borderBottom:`1px solid ${s.border}`}}>{m.musculo}kg</td><td style={{padding:'10px',fontSize:12,color:s.gold,borderBottom:`1px solid ${s.border}`}}>{m.grasa_pct}%</td><td style={{padding:'10px',fontSize:12,color:s.accent,borderBottom:`1px solid ${s.border}`}}>{m.inbody||'—'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MEDIDAS */}
        {page==='medidas' && (
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
          </div>
        )}

      </div>

      {toast && <div style={{position:'fixed',bottom:28,right:28,background:s.accent,color:'#000',padding:'10px 20px',borderRadius:8,fontWeight:700,fontSize:13,zIndex:300,boxShadow:'0 4px 20px rgba(0,0,0,.5)'}}>{toast}</div>}
    </div>
  )
}