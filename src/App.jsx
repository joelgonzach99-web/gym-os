import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const ROUTINES = {
  lunes:{title:'Pecho + Tríceps',badge:'PUSH',exercises:[
    {id:'e1',name:'Press de banca plano',detail:'4 × 8-10 reps'},
    {id:'e2',name:'Press inclinado mancuernas',detail:'4 × 10-12 reps'},
    {id:'e3',name:'Aperturas mancuernas',detail:'3 × 12-15 reps'},
    {id:'e4',name:'Fondos en paralelas',detail:'3 × 10-12 reps'},
    {id:'e5',name:'Extensiones tríceps polea',detail:'3 × 12-15 reps'},
  ]},
  martes:{title:'Espalda + Bíceps',badge:'PULL',exercises:[
    {id:'e6',name:'Dominadas con peso',detail:'4 × 6-8 reps'},
    {id:'e7',name:'Remo con barra',detail:'4 × 8-10 reps'},
    {id:'e8',name:'Jalón al pecho',detail:'3 × 10-12 reps'},
    {id:'e9',name:'Curl con barra',detail:'4 × 10-12 reps'},
    {id:'e10',name:'Curl martillo',detail:'3 × 12 reps'},
  ]},
  miercoles:{title:'Piernas',badge:'LEGS',exercises:[
    {id:'e11',name:'Sentadilla libre',detail:'4 × 8-10 reps'},
    {id:'e12',name:'Prensa de piernas',detail:'4 × 10-12 reps'},
    {id:'e13',name:'Extensiones cuádriceps',detail:'3 × 12-15 reps'},
    {id:'e14',name:'Curl femoral',detail:'3 × 12 reps'},
    {id:'e15',name:'Pantorrillas de pie',detail:'4 × 15-20 reps'},
  ]},
  jueves:{title:'Hombros + Core',badge:'SHOULDERS',exercises:[
    {id:'e16',name:'Press militar',detail:'4 × 8-10 reps'},
    {id:'e17',name:'Elevaciones laterales',detail:'4 × 12-15 reps'},
    {id:'e18',name:'Face pulls',detail:'3 × 15 reps'},
    {id:'e19',name:'Plancha',detail:'3 × 60 seg'},
    {id:'e20',name:'Abdominales en polea',detail:'3 × 15 reps'},
  ]},
  viernes:{title:'Full Body · Fuerza',badge:'FULL',exercises:[
    {id:'e21',name:'Peso muerto',detail:'4 × 5-6 reps pesado'},
    {id:'e22',name:'Sentadilla búlgara',detail:'3 × 10 reps'},
    {id:'e23',name:'Press banca agarre cerrado',detail:'3 × 8-10 reps'},
    {id:'e24',name:'Remo con mancuerna',detail:'3 × 10-12 reps'},
  ]},
  sabado:{title:'Cardio + Movilidad',badge:'CARDIO',exercises:[
    {id:'e25',name:'HIIT 20 minutos',detail:'20seg on / 10seg off × 8'},
    {id:'e26',name:'Caminata 30 minutos',detail:'Ritmo moderado'},
    {id:'e27',name:'Stretching full body',detail:'15 minutos'},
  ]},
  domingo:{title:'Descanso Activo',badge:'REST',exercises:[
    {id:'e28',name:'Caminar o nadar',detail:'Actividad ligera'},
    {id:'e29',name:'Meditación 10 min',detail:'Visualización'},
    {id:'e30',name:'Meal prep',detail:'Preparar comidas'},
  ]},
}

const DAYS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
const DAYS_ES = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

const s = {
  bg:'#0a0a0a',surf:'#111',surf2:'#161616',border:'#1f1f1f',border2:'#2a2a2a',
  text:'#f0f0f0',muted:'#555',accent:'#e8ff3c',green:'#3cffb4',red:'#ff3c3c',blue:'#3c9fff',gold:'#d4a843'
}

const C = {
  sidebar:{position:'fixed',left:0,top:0,bottom:0,width:220,background:s.surf,borderRight:`1px solid ${s.border}`,display:'flex',flexDirection:'column',zIndex:100,fontFamily:'system-ui,sans-serif'},
  main:{marginLeft:220,padding:'32px 36px',minHeight:'100vh',fontFamily:'system-ui,sans-serif',background:s.bg,color:s.text},
  navItem:(active)=>({display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:6,cursor:'pointer',fontSize:13,fontWeight:500,color:active?s.accent:'#888',background:active?'rgba(232,255,60,.08)':'transparent',border:active?`1px solid rgba(232,255,60,.15)`:'1px solid transparent',marginBottom:2}),
  card:{background:s.surf,border:`1px solid ${s.border}`,borderRadius:10,padding:20},
  inp:{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:6,padding:'9px 12px',color:s.text,fontFamily:'system-ui,sans-serif',fontSize:13,outline:'none',width:'100%'},
  btn:{fontWeight:700,padding:'9px 16px',borderRadius:6,border:'none',cursor:'pointer',fontSize:13},
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [currentDay, setCurrentDay] = useState(DAYS[new Date().getDay()===0?6:new Date().getDay()-1])
  const [checks, setChecks] = useState({})
  const [foods, setFoods] = useState([])
  const [medidas, setMedidas] = useState([])
  const [foodForm, setFoodForm] = useState({nombre:'',cals:'',proteina:'',carbos:'',grasas:''})
  const [medForm, setMedForm] = useState({peso:'',musculo:'',grasa_kg:'',grasa_pct:'',cintura:'',bicep:'',inbody:'',notas:''})
  const [toast, setToast] = useState('')

  const today = new Date().toDateString()
  const fechaHoy = new Date().toLocaleDateString('es-ES')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [c, f, m] = await Promise.all([
      supabase.from('gym_checks').select('*').eq('fecha', today),
      supabase.from('gym_foods').select('*').eq('fecha', today),
      supabase.from('gym_medidas').select('*').order('created_at', {ascending:false}),
    ])
    if(c.data) { const ch={}; c.data.forEach(x=>ch[x.exercise_id]=x.done); setChecks(ch) }
    if(f.data) setFoods(f.data)
    if(m.data) setMedidas(m.data)
  }

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(''),2500) }

  async function toggleCheck(id) {
    const done = !checks[id]
    setChecks(prev=>({...prev,[id]:done}))
    const existing = await supabase.from('gym_checks').select('id').eq('fecha',today).eq('exercise_id',id).single()
    if(existing.data) {
      await supabase.from('gym_checks').update({done}).eq('id',existing.data.id)
    } else {
      await supabase.from('gym_checks').insert({fecha:today,exercise_id:id,done})
    }
  }

  async function addFood() {
    if(!foodForm.nombre) return
    const f = {...foodForm, fecha:today, cals:+foodForm.cals||0, proteina:+foodForm.proteina||0, carbos:+foodForm.carbos||0, grasas:+foodForm.grasas||0}
    const {data} = await supabase.from('gym_foods').insert(f).select().single()
    if(data) { setFoods(prev=>[...prev,data]); setFoodForm({nombre:'',cals:'',proteina:'',carbos:'',grasas:''}); showToast('✅ '+f.nombre+' agregado') }
  }

  async function removeFood(id) {
    await supabase.from('gym_foods').delete().eq('id',id)
    setFoods(prev=>prev.filter(f=>f.id!==id))
  }

  async function saveMedida() {
    if(!medForm.peso) { showToast('⚠️ Ingresá el peso'); return }
    const m = {...medForm, fecha:fechaHoy, peso:+medForm.peso, musculo:+medForm.musculo||0, grasa_kg:+medForm.grasa_kg||0, grasa_pct:+medForm.grasa_pct||0, cintura:+medForm.cintura||0, bicep:+medForm.bicep||0, inbody:+medForm.inbody||0}
    const {data} = await supabase.from('gym_medidas').insert(m).select().single()
    if(data) { setMedidas(prev=>[data,...prev]); setMedForm({peso:'',musculo:'',grasa_kg:'',grasa_pct:'',cintura:'',bicep:'',inbody:'',notas:''}); showToast('💾 Medición guardada') }
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
  const pesoActual = lastMedida?.peso || 73.6
  const musculoActual = lastMedida?.musculo || 35.6
  const grasaPct = lastMedida?.grasa_pct || 15

  return (
    <div style={{display:'flex'}}>
      {/* SIDEBAR */}
      <div style={C.sidebar}>
        <div style={{padding:'24px 20px 16px',borderBottom:`1px solid ${s.border}`}}>
          <div style={{fontSize:28,marginBottom:4}}>💪</div>
          <div style={{fontSize:22,fontWeight:900,color:s.accent,letterSpacing:2}}>GYM OS</div>
          <div style={{fontSize:10,color:s.muted,letterSpacing:3,textTransform:'uppercase'}}>Joel · Bulk 2026</div>
        </div>
        <div style={{padding:'12px 16px',borderBottom:`1px solid ${s.border}`,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[['Peso',pesoActual+'kg',s.text],['Grasa',grasaPct+'%',s.gold],['Músculo',musculoActual+'kg',s.green],['InBody','80/100',s.accent]].map(([l,v,c])=>(
            <div key={l} style={{background:s.surf2,border:`1px solid ${s.border}`,borderRadius:6,padding:'8px 10px'}}>
              <div style={{fontSize:9,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:3}}>{l}</div>
              <div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{padding:'12px 10px',flex:1}}>
          {[['⚡','dashboard','Dashboard'],['🏋️','rutina','Rutina'],['🥗','nutricion','Nutrición'],['📈','progreso','Progreso'],['📏','medidas','Medidas']].map(([icon,id,label])=>(
            <div key={id} style={C.navItem(page===id)} onClick={()=>setPage(id)}>
              <span style={{fontSize:14,width:20,textAlign:'center'}}>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={C.main}>

        {/* DASHBOARD */}
        {page==='dashboard' && (
          <div>
            <div style={{marginBottom:28}}>
              <div style={{fontSize:28,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Panel General</div>
              <div style={{fontSize:12,color:s.muted,marginTop:4}}>BULK LIMPIO · OBJETIVO 3 MESES · {new Date().toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'}).toUpperCase()}</div>
            </div>
            <div style={{background:`linear-gradient(135deg,rgba(232,255,60,.05),rgba(60,255,180,.03))`,border:`1px solid rgba(232,255,60,.15)`,borderRadius:10,padding:'20px 24px',marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:s.accent,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>📊 InBody — Última medición</div>
                <div style={{fontSize:12,color:s.muted}}>Mayo 2026 · Miami</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:42,fontWeight:900,color:s.accent,lineHeight:1}}>80</div>
                <div style={{fontSize:9,color:s.muted,letterSpacing:2}}>INBODY SCORE</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
              {[['Peso actual',pesoActual+' kg','Obj: 78 kg',s.text,30],['Músculo',musculoActual+' kg','Obj: 38 kg',s.green,40],['Grasa corporal','11 kg','15% · ≤16%',s.gold,65],['Calorías hoy',totalCals,'/ 2,850 kcal',s.accent,Math.min(totalCals/2850*100,100)]].map(([l,v,m,c,p])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>{l}</div>
                  <div style={{fontSize:26,fontWeight:900,color:c}}>{v}</div>
                  <div style={{fontSize:11,color:s.muted,marginTop:4}}>{m}</div>
                  <div style={{height:5,background:s.border2,borderRadius:3,marginTop:8,overflow:'hidden'}}><div style={{height:'100%',width:p+'%',background:c,borderRadius:3,transition:'width .5s'}}/></div>
                </div>
              ))}
            </div>
            <div style={{...C.card,marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{fontSize:14,fontWeight:700,color:s.accent,letterSpacing:2,textTransform:'uppercase'}}>🎯 Objetivo Bulk 3 meses</div>
                <div style={{fontSize:11,color:s.muted}}>Mayo → Agosto 2026</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                {[['Peso','73.6 kg','→ 78 kg (+4.4kg)'],['Músculo','35.6 kg','→ 38 kg (+2.4kg)'],['% Grasa','15%','Mantener ≤ 16%']].map(([l,c,t])=>(
                  <div key={l} style={{textAlign:'center'}}>
                    <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:4}}>{l}</div>
                    <div style={{fontSize:22,fontWeight:900}}>{c}</div>
                    <div style={{fontSize:11,color:s.accent,marginTop:2}}>{t}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{...C.card}}>
              <div style={{fontSize:12,fontWeight:700,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>Rutina de hoy — {r.title}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <div style={{fontSize:12,color:s.muted}}>{doneCnt}/{r.exercises.length} ejercicios</div>
                <div style={{fontSize:14,fontWeight:800,color:s.green}}>{pct}%</div>
              </div>
              <div style={{height:8,background:s.border2,borderRadius:4,overflow:'hidden'}}><div style={{height:'100%',width:pct+'%',background:s.green,borderRadius:4,transition:'width .4s'}}/></div>
            </div>
          </div>
        )}

        {/* RUTINA */}
        {page==='rutina' && (
          <div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:28,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Rutina Semanal</div>
            </div>
            <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
              {DAYS.map((d,i)=>(
                <div key={d} onClick={()=>setCurrentDay(d)} style={{padding:'7px 14px',borderRadius:5,cursor:'pointer',fontSize:12,fontWeight:700,letterSpacing:1,textTransform:'uppercase',background:currentDay===d?'rgba(232,255,60,.1)':s.surf,border:`1px solid ${currentDay===d?'rgba(232,255,60,.3)':s.border}`,color:currentDay===d?s.accent:'#888',transition:'all .15s'}}>{DAYS_ES[i]}</div>
              ))}
            </div>
            <div style={{...C.card,marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:22,fontWeight:900,textTransform:'uppercase'}}>{r.title}</div>
                <div style={{fontSize:12,color:s.muted,marginTop:3}}>{r.badge}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:22,fontWeight:900,color:s.green}}>{pct}%</div>
                <div style={{fontSize:11,color:s.muted}}>{doneCnt}/{r.exercises.length} hechos</div>
              </div>
            </div>
            <div style={{height:8,background:s.border2,borderRadius:4,overflow:'hidden',marginBottom:14}}><div style={{height:'100%',width:pct+'%',background:s.green,borderRadius:4,transition:'width .4s'}}/></div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {r.exercises.map(e=>(
                <div key={e.id} onClick={()=>toggleCheck(e.id)} style={{...C.card,display:'flex',alignItems:'center',gap:14,cursor:'pointer',background:checks[e.id]?'rgba(60,255,180,.04)':s.surf,border:`1px solid ${checks[e.id]?'rgba(60,255,180,.2)':s.border}`,transition:'all .15s'}}>
                  <div style={{width:22,height:22,borderRadius:'50%',border:`2px solid ${checks[e.id]?s.green:s.border2}`,background:checks[e.id]?s.green:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all .2s'}}>
                    {checks[e.id] && <span style={{color:'#000',fontSize:12,fontWeight:900}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:checks[e.id]?s.muted:s.text,textDecoration:checks[e.id]?'line-through':'none'}}>{e.name}</div>
                    <div style={{fontSize:11,color:s.muted,marginTop:2}}>{e.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUTRICION */}
        {page==='nutricion' && (
          <div>
            <div style={{marginBottom:24}}><div style={{fontSize:28,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Nutrición</div><div style={{fontSize:12,color:s.muted,marginTop:4}}>BULK LIMPIO · 2,850 KCAL · 148G PROTEÍNA</div></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
              {[['Calorías',totalCals,2850,'kcal',s.accent],['Proteína',totalProt,148,'g',s.blue],['Carbohidratos',totalCarbs,320,'g',s.green],['Grasas',totalFats,80,'g',s.gold]].map(([l,v,obj,u,c])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>{l}</div>
                  <div style={{fontSize:26,fontWeight:900,color:c}}>{v}{u!=='kcal'?u:''}</div>
                  <div style={{fontSize:11,color:s.muted,marginTop:4}}>/ {obj} {u}</div>
                  <div style={{height:5,background:s.border2,borderRadius:3,marginTop:8,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(v/obj*100,100)+'%',background:c,borderRadius:3}}/></div>
                </div>
              ))}
            </div>
            <div style={{...C.card,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:12}}>+ Agregar alimento</div>
              <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr auto',gap:8,alignItems:'flex-end'}}>
                {[['nombre','Alimento','Ej: Pollo'],['cals','Kcal','0'],['proteina','Proteína g','0'],['carbos','Carbos g','0'],['grasas','Grasas g','0']].map(([k,l,ph])=>(
                  <div key={k}>
                    <div style={{fontSize:9,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>{l}</div>
                    <input style={C.inp} placeholder={ph} value={foodForm[k]} onChange={e=>setFoodForm(p=>({...p,[k]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addFood()}/>
                  </div>
                ))}
                <button onClick={addFood} style={{...C.btn,background:s.accent,color:'#000',height:38}}>+</button>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {todayFoods.length===0 ? <div style={{color:s.muted,fontSize:13,padding:12}}>Sin alimentos registrados hoy.</div> :
              todayFoods.map(f=>(
                <div key={f.id} style={{...C.card,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px'}}>
                  <div style={{fontSize:14,fontWeight:500}}>{f.nombre}</div>
                  <div style={{display:'flex',gap:16,fontSize:12,color:s.muted}}>
                    <span>P: <b style={{color:s.text}}>{f.proteina}g</b></span>
                    <span>C: <b style={{color:s.text}}>{f.carbos}g</b></span>
                    <span>G: <b style={{color:s.text}}>{f.grasas}g</b></span>
                  </div>
                  <div style={{fontSize:14,fontWeight:700,color:s.accent}}>{f.cals} kcal</div>
                  <button onClick={()=>removeFood(f.id)} style={{...C.btn,background:'rgba(255,60,60,.15)',border:`1px solid rgba(255,60,60,.3)`,color:s.red,padding:'4px 10px',fontSize:11}}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESO */}
        {page==='progreso' && (
          <div>
            <div style={{marginBottom:24}}><div style={{fontSize:28,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Progreso</div></div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
              {[['Peso',pesoActual+' kg',lastMedida?(+pesoActual-73.6>=0?'+':'')+((+pesoActual-73.6).toFixed(1))+' kg':'Inicio',+pesoActual>=73.6],['Músculo',musculoActual+' kg',lastMedida?(+musculoActual-35.6>=0?'+':'')+((+musculoActual-35.6).toFixed(1))+' kg':'Inicio',true],['% Grasa',grasaPct+'%',lastMedida?'Medido':'Baseline',+grasaPct<=16]].map(([l,v,d,pos])=>(
                <div key={l} style={C.card}>
                  <div style={{fontSize:10,color:s.muted,textTransform:'uppercase',letterSpacing:2,marginBottom:6}}>{l}</div>
                  <div style={{fontSize:28,fontWeight:900}}>{v}</div>
                  <div style={{fontSize:12,color:pos?s.green:s.red,marginTop:4}}>{d}</div>
                </div>
              ))}
            </div>
            <div style={C.card}>
              <div style={{fontSize:11,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>Historial de mediciones</div>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Fecha','Peso','Músculo','Grasa%','InBody'].map(h=><th key={h} style={{fontSize:10,color:s.muted,textAlign:'left',padding:'6px 10px',borderBottom:`1px solid ${s.border}`,letterSpacing:2,textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
                <tbody>
                  <tr><td style={{padding:'10px',fontSize:13,color:s.muted,borderBottom:`1px solid ${s.border}`}}>Mayo 2026</td><td style={{padding:'10px',fontSize:13,borderBottom:`1px solid ${s.border}`}}>73.6 kg</td><td style={{padding:'10px',fontSize:13,borderBottom:`1px solid ${s.border}`}}>35.6 kg</td><td style={{padding:'10px',fontSize:13,color:s.gold,borderBottom:`1px solid ${s.border}`}}>15%</td><td style={{padding:'10px',fontSize:13,color:s.accent,borderBottom:`1px solid ${s.border}`}}>80</td></tr>
                  {medidas.map(m=>(
                    <tr key={m.id}><td style={{padding:'10px',fontSize:13,color:s.muted,borderBottom:`1px solid ${s.border}`}}>{m.fecha}</td><td style={{padding:'10px',fontSize:13,borderBottom:`1px solid ${s.border}`}}>{m.peso} kg</td><td style={{padding:'10px',fontSize:13,borderBottom:`1px solid ${s.border}`}}>{m.musculo} kg</td><td style={{padding:'10px',fontSize:13,color:s.gold,borderBottom:`1px solid ${s.border}`}}>{m.grasa_pct}%</td><td style={{padding:'10px',fontSize:13,color:s.accent,borderBottom:`1px solid ${s.border}`}}>{m.inbody||'—'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MEDIDAS */}
        {page==='medidas' && (
          <div>
            <div style={{marginBottom:24}}><div style={{fontSize:28,fontWeight:900,letterSpacing:2,textTransform:'uppercase'}}>Medidas Corporales</div></div>
            <div style={{...C.card,marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:s.muted,letterSpacing:2,textTransform:'uppercase',marginBottom:14}}>📋 Nueva medición</div>
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

      {/* TOAST */}
      {toast && <div style={{position:'fixed',bottom:28,right:28,background:s.accent,color:'#000',padding:'10px 18px',borderRadius:7,fontWeight:700,fontSize:13,zIndex:300}}>{toast}</div>}
    </div>
  )
}