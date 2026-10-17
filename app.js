"use strict";
/* ================= Danh mục ================= */
const TAX = [
 {id:"listening",sec:"Section I",name:"Listening",pts:"2.0",kinds:[
  {id:"l-mcq",name:"Trắc nghiệm A–D",focus:["Đọc trước câu hỏi, gạch chân từ khóa trước khi nghe.","Bẫy hay gặp: thông tin bị người nói sửa lại, nhiều con số gây nhiễu."]},
  {id:"l-gap",name:"Điền tờ rơi / ghi chú / bảng",focus:["Đoán loại từ cần điền trước khi nghe.","Luyện nghe số, ngày tháng, tên riêng được đánh vần; kiểm tra chính tả và giới hạn số từ."]},
  {id:"l-tf",name:"Đúng / Sai / Không có thông tin",focus:["Phân biệt Sai (trái với bài) và Không có thông tin (bài không nói)."]},
  {id:"l-short",name:"Trả lời câu hỏi ngắn",focus:["Trả lời đúng giới hạn số từ, đúng ngữ pháp với câu hỏi."]},
  {id:"l-full",name:"Đề nghe đầy đủ",focus:["Bài nghe nguyên phần Listening của đề, có đề và đáp án."]}]},
 {id:"lexico",sec:"Section II",name:"Lexico-Grammar",pts:"2.0",kinds:[
  {id:"g-grammar",name:"Ngữ pháp trọng tâm",focus:["Câu điều kiện (cả hỗn hợp và đảo ngữ), giả định cách, mệnh đề quan hệ, đảo ngữ, bị động, câu chẻ, câu ước."]},
  {id:"g-phrasal",name:"Cụm động từ"},{id:"g-prep",name:"Giới từ"},{id:"g-colloc",name:"Collocation"},{id:"g-idiom",name:"Thành ngữ"},
  {id:"g-wordform",name:"Chia dạng từ",focus:["Hậu tố tạo danh từ, tính từ, trạng từ, động từ; tiền tố phủ định in-, im-, ir-, dis-, un-, mis-."]},
  {id:"g-error",name:"Tìm và sửa lỗi",focus:["Lỗi dạng từ, hòa hợp chủ ngữ – động từ, phân từ -ing/-ed, many/much."]}]},
 {id:"reading",sec:"Section III",name:"Reading",pts:"3.0",kinds:[
  {id:"r-open",name:"Điền một từ vào đoạn văn"},{id:"r-guided",name:"Đoạn văn trắc nghiệm A–D"},
  {id:"r-mcq",name:"Đọc hiểu trắc nghiệm",focus:["Ý chính, chi tiết, suy luận, từ vựng trong ngữ cảnh, NOT TRUE, từ quy chiếu.","Mỗi đáp án phải chỉ ra được câu làm bằng chứng trong bài."]},
  {id:"r-long",name:"Đọc đoạn dài"},{id:"r-gapped",name:"Điền câu vào đoạn văn"},{id:"r-heading",name:"Chọn tiêu đề cho đoạn"},{id:"r-match",name:"Nối thông tin với đoạn văn"}]},
 {id:"writing",sec:"Section IV",name:"Writing",pts:"3.0",kinds:[
  {id:"w-rewrite",name:"Viết lại câu"},{id:"w-key",name:"Viết lại câu với từ khóa"},
  {id:"w-email",name:"Viết email / thư",focus:["Mở đầu, trả lời đủ từng câu hỏi, kết thư; đúng 100–120 từ."]},
  {id:"w-essay",name:"Bài luận",focus:["Bố cục 4 đoạn, phát triển ý PEEL, 230–250 từ.","Chữa 2 vòng: giáo viên đánh dấu lỗi, học sinh tự sửa và nộp bản 2."]}]},
 {id:"tests",sec:"Luyện đề",name:"Đề thi",pts:null,kinds:[
  {id:"t-gialai",name:"Đề Gia Lai các năm"},{id:"t-other",name:"Đề chuyên tỉnh khác"},{id:"t-mock",name:"Đề thi thử của trung tâm"}]},
 {id:"vocab",sec:"Bổ trợ",name:"Từ vựng theo chủ đề",pts:null,kinds:[
  {id:"v-env",name:"Môi trường"},{id:"v-edu",name:"Giáo dục"},{id:"v-tech",name:"Công nghệ"},{id:"v-health",name:"Sức khỏe"},{id:"v-culture",name:"Văn hóa"},{id:"v-other",name:"Chủ đề khác"}]}
];
const kindIndex={}; TAX.forEach(s=>s.kinds.forEach(k=>kindIndex[k.id]={...k,skill:s}));

/* ================= Helpers ================= */
const $=s=>document.querySelector(s);
function el(tag,attrs={},...kids){const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs)){if(v==null||v===false)continue;if(k==="class")e.className=v;else if(k==="text")e.textContent=v;else if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?"":v)}for(const c of kids.flat()){if(c==null)continue;e.append(c instanceof Node?c:document.createTextNode(c))}return e}
const fmtDate=ms=>{try{return new Date(ms).toLocaleDateString("vi-VN")}catch{return ""}};
const safeLink=u=>/^https?:\/\//i.test(u||"")?u:null;
const store={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}},del(k){try{localStorage.removeItem(k)}catch{}}};
const norm=c=>(c||"").trim().toUpperCase().replace(/\s+/g,"");
function rand(n,alpha="abcdefghijklmnopqrstuvwxyz0123456789"){const r=crypto.getRandomValues(new Uint8Array(n));return Array.from(r,x=>alpha[x%alpha.length]).join("")}
async function copyText(t,btn){try{await navigator.clipboard.writeText(t);if(btn){const o=btn.textContent;btn.textContent="Đã chép";setTimeout(()=>btn.textContent=o,1500)}}catch{if(btn)btn.textContent=t}}
document.addEventListener("click",e=>{const c=e.target.closest("[data-copy]");if(c)copyText(c.dataset.copy,c)});

/* ================= Kết nối ================= */
const cfg=window.APP_CONFIG||{};
const sb=(window.supabase&&cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY)?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
const BUCKET="chuyen-anh";

/* ================= State ================= */
let isEditor=false, ready=false, settings=null, items=[], loading=true, studentCode=null;
const filt={skill:"",kind:"",q:"",level:""}; let lisKind="";
const pubUrl=(path,dl)=>sb.storage.from(BUCKET).getPublicUrl(path,dl?{download:dl}:undefined).data.publicUrl;
function shape(r){return{id:r.id,title:r.title,topic:r.topic||"",skill:r.skill,kind:r.kind,level:r.level,desc:r.descr||"",link:r.link,
  showAnswers:r.show_answers!==false,exam:r.exam||null,key:r.answer||null,hasKey:r.has_answer!=null?!!r.has_answer:!!r.answer,audio:r.audio||null,
  createdAt:Date.parse(r.created_at)||0}}

/* ================= Gate ================= */
function showGate(msg,mode){
  $("#appView").hidden=true; $("#gateView").hidden=false;
  $("#gateMsg").textContent=msg;
  $("#gateForm").hidden=mode!=="code"; $("#setupForm").hidden=mode!=="setup"; $("#loginForm").hidden=mode!=="login";
  $("#toggleLogin").hidden=!(mode==="code"||mode==="login"); $("#toggleLogin").textContent=mode==="login"?"← Học sinh nhập mã":"Giáo viên đăng nhập";
  if(mode==="code")setTimeout(()=>$("#gateCode").focus(),50);
}
function showApp(){$("#gateView").hidden=true;$("#appView").hidden=false}
$("#toggleLogin").addEventListener("click",()=>{const toLogin=$("#loginForm").hidden;showGate(toLogin?"Đăng nhập bằng tài khoản giáo viên (cùng tài khoản với web IELTS Writing).":"Nhập mã truy cập cô Trâm gửi để vào kho tài liệu.",toLogin?"login":"code")});

async function fetchStudent(code){
  const {data,error}=await sb.rpc("ca_list",{p_code:code});
  if(error){const e=new Error(/invalid_code/.test(error.message||"")?"invalid":"network");throw e}
  return (data||[]).map(shape);
}
$("#gateForm").addEventListener("submit",async e=>{
  e.preventDefault(); const st=$("#gateStatus"), btn=$("#gateBtn"); const code=norm($("#gateCode").value);
  if(!code){st.className="status err";st.textContent="Hãy nhập mã.";return}
  btn.disabled=true; st.className="status"; st.textContent="Đang kiểm tra…";
  try{items=await fetchStudent(code); studentCode=code; store.set("mst-code",code); st.textContent=""; loading=false; enterApp()}
  catch(err){st.className="status err";st.textContent=err.message==="invalid"?"Mã không đúng hoặc đã đổi. Hỏi cô Trâm mã mới.":"Không kết nối được. Kiểm tra mạng rồi thử lại."}
  finally{btn.disabled=false}
});
$("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault(); const st=$("#loginStatus"), btn=$("#loginBtn"); btn.disabled=true; st.className="status"; st.textContent="Đang đăng nhập…";
  const {error}=await sb.auth.signInWithPassword({email:$("#loginEmail").value.trim(),password:$("#loginPass").value});
  btn.disabled=false;
  if(error){st.className="status err";st.textContent="Sai email hoặc mật khẩu.";return}
  st.textContent=""; await startTeacher();
});
$("#setupForm").addEventListener("submit",async e=>{
  e.preventDefault(); const st=$("#setupStatus"); const code=norm($("#setupCode").value);
  if(!/^[A-Z0-9-]{4,24}$/.test(code)){st.className="status err";st.textContent="Mã gồm 4–24 ký tự: chữ không dấu, số hoặc dấu gạch ngang.";return}
  st.className="status";st.textContent="Đang lưu…";
  const row={id:1,code,prefix:rand(32),updated_at:new Date().toISOString()};
  const {error}=await sb.from("ca_settings").upsert(row);
  if(error){st.className="status err";st.textContent="Lưu không được: "+error.message;return}
  settings=row; await loadTeacherItems(); enterApp();
});
$("#logoutBtn").addEventListener("click",()=>{store.del("mst-code");studentCode=null;lockOut("Đã thoát. Nhập mã để vào lại.")});
$("#signoutBtn").addEventListener("click",async()=>{await sb.auth.signOut();isEditor=false;lockOut("Đã đăng xuất.")});
function lockOut(msg){ready=false;items=[];showGate(msg,"code")}
/* Học sinh: kiểm tra lại mã khi quay lại tab, mã đổi thì khoá */
document.addEventListener("visibilitychange",async()=>{
  if(document.hidden||isEditor||!studentCode||!ready)return;
  try{items=await fetchStudent(studentCode);renderAll()}
  catch(err){if(err.message==="invalid"){store.del("mst-code");studentCode=null;lockOut("Mã đã được đổi. Hỏi cô Trâm mã mới để vào tiếp.")}}
});

/* ================= Giáo viên ================= */
async function loadTeacherItems(){
  loading=true;
  const {data,error}=await sb.from("ca_items").select("*").order("created_at",{ascending:false});
  loading=false; if(!error)items=(data||[]).map(shape); if(ready)renderAll();
}
async function startTeacher(){
  const {data:ok}=await sb.rpc("ca_is_teacher");
  if(!ok){await sb.auth.signOut();showGate("Tài khoản này chưa có quyền giáo viên. Thêm email vào bảng ca_teachers trong Supabase (xem README).","login");return}
  isEditor=true;
  const {data:s}=await sb.from("ca_settings").select("*").eq("id",1).maybeSingle();
  if(!s){showGate("Chào cô Trâm! Đặt mã truy cập đầu tiên cho học sinh (4–24 ký tự).","setup");return}
  settings=s; await loadTeacherItems(); enterApp();
}

/* ================= App ================= */
function enterApp(){
  showApp(); ready=true;
  $("#role").textContent=isEditor?"Giáo viên":"Học sinh";
  $("#codeBtn").hidden=!isEditor; $("#signoutBtn").hidden=!isEditor; $("#logoutBtn").hidden=isEditor;
  document.querySelectorAll("[data-upload]").forEach(b=>b.hidden=!isEditor);
  let t="home"; const h=location.hash.slice(1); const saved=store.get("mst-tab");
  if(["listening","library","practice","contact"].includes(h))t=h; else if(saved)t=saved;
  go(t); renderAll();
}
async function refresh(){if(isEditor)await loadTeacherItems();else if(studentCode){items=await fetchStudent(studentCode)}renderAll()}
function go(tab){
  ["home","listening","library","practice","contact"].forEach(t=>{$("#v-"+t).hidden=t!==tab});
  document.querySelectorAll("nav.tabs button").forEach(b=>{if(b.dataset.tab===tab)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  store.set("mst-tab",tab); window.scrollTo(0,0);
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-tab],[data-go]");if(b)go(b.dataset.tab||b.dataset.go)});

/* ---------- files ---------- */
const MIME={pdf:"application/pdf",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",webp:"image/webp",gif:"image/gif",txt:"text/plain",
  mp3:"audio/mpeg",m4a:"audio/mp4",wav:"audio/wav",ogg:"audio/ogg",aac:"audio/aac",
  docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"};
const VIEWABLE=/^(application\/pdf|image\/|text\/plain)/;
const extOf=n=>(n.split(".").pop()||"").toLowerCase();
const isAudio=f=>f&&/^audio\//.test(f.mime||"");
async function storeFile(file,st,label){
  const ext=extOf(file.name), mime=MIME[ext];
  if(!mime)throw{message:`Định dạng .${ext} chưa hỗ trợ. Dùng PDF, Word (.docx), ảnh hoặc MP3.`};
  if(file.size>50*1024*1024)throw{message:`${label} lớn hơn 50 MB.`};
  st.textContent=`Đang tải ${label.toLowerCase()} lên…`;
  const path=`${settings.prefix}/${rand(20)}.${ext}`;
  const {error}=await sb.storage.from(BUCKET).upload(path,file,{contentType:mime,upsert:false});
  if(error)throw{message:`Tải ${label.toLowerCase()} không được: ${error.message}`};
  return{path,name:file.name,mime,size:file.size};
}
function playInto(box,f,btn){
  box.replaceChildren(el("audio",{controls:true,src:pubUrl(f.path),preload:"auto"}),el("span",{class:"muted",style:"font-size:12.5px",text:f.name}));
  box.hidden=false; const a=box.querySelector("audio"); a.play().catch(()=>{}); if(btn)btn.textContent="Đang phát";
}
function fileBtn(f,label,primary,playerBox){
  const cls="btn small"+(primary?" primary":"");
  if(isAudio(f)){const b=el("button",{class:cls,type:"button"},"▶ "+label);b.addEventListener("click",()=>playInto(playerBox,f,b));return b}
  if(VIEWABLE.test(f.mime||""))return el("a",{class:cls,href:pubUrl(f.path),target:"_blank",rel:"noopener"},label);
  return el("a",{class:cls,href:pubUrl(f.path,f.name),rel:"noopener"},label+" (tải về)");
}

/* ---------- item card ---------- */
const playIcon='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
function itemCard(m,asTrack){
  const k=kindIndex[m.kind];
  const player=el("div",{class:"player",hidden:true});
  const acts=el("div",{class:"acts"});
  if(m.audio)acts.append(fileBtn(m.audio,"Nghe",true,player));
  if(m.exam)acts.append(fileBtn(m.exam,"Mở đề",!m.audio,player));
  if(m.key&&(isEditor||m.showAnswers))acts.append(fileBtn(m.key,"Đáp án",false,player));
  else if(m.hasKey)acts.append(el("span",{class:"chip hide",text:"Đáp án sẽ mở sau"}));
  const link=safeLink(m.link); if(link)acts.append(el("a",{class:"btn small",href:link,target:"_blank",rel:"noopener"},"Mở link"));
  if(isEditor){
    if(m.key){const tg=el("button",{class:"btn small ghost",type:"button"},m.showAnswers?"Ẩn đáp án":"Mở đáp án cho HS");
      tg.addEventListener("click",async()=>{tg.disabled=true;const {error}=await sb.from("ca_items").update({show_answers:!m.showAnswers}).eq("id",m.id);if(error){tg.disabled=false;tg.textContent="Không lưu được"}else refresh()});acts.append(tg)}
    const del=el("button",{class:"btn small danger",type:"button"},"Xoá");
    del.addEventListener("click",async()=>{
      if(del.dataset.arm!=="1"){del.dataset.arm="1";del.textContent="Bấm lần nữa để xoá";setTimeout(()=>{del.dataset.arm="";del.textContent="Xoá"},4000);return}
      del.disabled=true;del.textContent="Đang xoá…";
      const {error}=await sb.from("ca_items").delete().eq("id",m.id);
      if(error){del.disabled=false;del.textContent="Xoá không được, thử lại";return}
      const paths=[m.exam,m.key,m.audio].filter(Boolean).map(f=>f.path); if(paths.length)await sb.storage.from(BUCKET).remove(paths);
      refresh();
    });
    acts.append(del);
  }
  const meta=el("div",{class:"meta"},el("span",{class:"chip lv",text:m.level||"—"}),
    el("span",{text:k?`${k.skill.name} · ${k.name}`:""}),m.topic?el("span",{text:"· "+m.topic}):null,m.createdAt?el("span",{text:"· "+fmtDate(m.createdAt)}):null,
    (isEditor&&!m.showAnswers&&m.key)?el("span",{class:"chip hide",text:"HS chưa thấy đáp án"}):null);
  const body=el("div",{class:"body"},el("h4",{text:m.title||"(Không có tiêu đề)"}),meta,m.desc?el("p",{class:"desc",text:m.desc}):null,acts,player);
  if(asTrack){
    const ic=el("button",{class:"ic",type:"button","aria-label":"Phát "+(m.title||"")});ic.innerHTML=playIcon;
    if(m.audio)ic.addEventListener("click",()=>playInto(player,m.audio,acts.querySelector("button")));else ic.disabled=true;
    return el("article",{class:"item track"},ic,body);
  }
  return el("article",{class:"item"},body);
}
function emptyState(text){
  const e=el("div",{class:"empty"});
  if(loading){e.append(el("b",{text:"Đang tải…"}));return e}
  e.append(el("b",{text:text||"Chưa có tài liệu"}),el("span",{text:isEditor?"Bấm nút “+ Đăng” để thêm tài liệu đầu tiên.":"Cô Trâm sẽ đăng tài liệu sớm."}));
  return e;
}

/* ---------- views ---------- */
function renderSkillCards(){
  const box=$("#skillCards"); box.replaceChildren();
  TAX.filter(s=>s.pts).forEach(s=>{
    const n=items.filter(m=>m.skill===s.id).length;
    box.append(el("button",{class:"skill",onclick:()=>{if(s.id==="listening"){go("listening");return}filt.skill=s.id;filt.kind="";go("library");renderLibrary()}},
      el("span",{class:"sec",text:s.sec}),el("h3",{text:s.name}),el("span",{class:"pts",text:s.pts+" điểm"}),
      el("span",{class:"count",text:`${n} tài liệu · ${s.kinds.length} dạng bài`})));
  });
}
function renderRecent(){const b=$("#recent");b.replaceChildren();const r=items.slice(0,5);if(!r.length){b.append(emptyState());return}r.forEach(m=>b.append(itemCard(m)))}
function renderListening(){
  const p=$("#lisPills"); p.replaceChildren();
  const lk=TAX[0].kinds;
  p.append(el("button",{"aria-pressed":String(!lisKind),onclick:()=>{lisKind="";renderListening()}},"Tất cả"));
  lk.forEach(k=>p.append(el("button",{"aria-pressed":String(lisKind===k.id),onclick:()=>{lisKind=k.id;renderListening()}},k.name)));
  const box=$("#lisList"); box.replaceChildren();
  const r=items.filter(m=>(m.skill==="listening"||m.audio)&&(!lisKind||m.kind===lisKind));
  if(!r.length){box.append(emptyState("Chưa có bài nghe"));return}
  r.forEach(m=>box.append(itemCard(m,true)));
}
const countBy=fn=>items.filter(fn).length;
function renderIndex(){
  const box=$("#index"); box.replaceChildren();
  box.append(el("button",{class:"all","aria-pressed":String(!filt.skill&&!filt.kind),onclick:()=>{filt.skill="";filt.kind="";renderLibrary()}},`Tất cả (${items.length})`));
  TAX.forEach(s=>{
    const d=el("details",{open:(filt.skill===s.id||!filt.skill)?true:null});
    d.append(el("summary",{},el("span",{text:s.name}),el("span",{class:"n",text:String(countBy(m=>m.skill===s.id))})));
    const ks=el("div",{class:"kinds"});
    s.kinds.forEach(k=>ks.append(el("button",{"aria-pressed":String(filt.kind===k.id),onclick:()=>{filt.skill=s.id;filt.kind=k.id;renderLibrary()}},el("span",{text:k.name}),el("span",{class:"n",text:String(countBy(m=>m.kind===k.id))}))));
    d.append(ks); box.append(d);
  });
}
function renderTopicHead(){
  const h=$("#topicHead"); h.replaceChildren();
  if(filt.kind){const k=kindIndex[filt.kind];h.append(el("span",{class:"crumb",text:`${k.skill.sec} · ${k.skill.name}`}),el("h2",{text:k.name}));if(k.focus)h.append(el("ul",{},k.focus.map(f=>el("li",{text:f}))))}
  else if(filt.skill){const s=TAX.find(x=>x.id===filt.skill);h.append(el("span",{class:"crumb",text:s.sec+(s.pts?` · ${s.pts} điểm`:"")}),el("h2",{text:s.name}),el("p",{class:"muted",text:"Chọn một dạng bài ở cột bên để lọc."}))}
  else h.append(el("span",{class:"crumb",text:"Kho tài liệu"}),el("h2",{text:"Tất cả tài liệu"}),el("p",{class:"muted",text:"Đề, đáp án và tài liệu được sắp theo phần thi và dạng bài."}));
}
function renderList(){
  const q=filt.q.trim().toLowerCase();
  const r=items.filter(m=>(!filt.skill||m.skill===filt.skill)&&(!filt.kind||m.kind===filt.kind)&&(!filt.level||m.level===filt.level)&&(!q||[m.title,m.topic,m.desc].join(" ").toLowerCase().includes(q)));
  const box=$("#matList"); box.replaceChildren();
  if(!r.length){box.append(emptyState(items.length?"Không có tài liệu khớp bộ lọc":"Chưa có tài liệu"));return}
  r.forEach(m=>box.append(itemCard(m)));
}
function renderLibrary(){renderIndex();renderTopicHead();renderList()}
function renderAll(){if(!ready)return;renderSkillCards();renderRecent();renderListening();renderLibrary()}
$("#q").addEventListener("input",e=>{filt.q=e.target.value;renderList()});
$("#fl-level").addEventListener("change",e=>{filt.level=e.target.value;renderList()});

/* ---------- upload (teacher) ---------- */
const fSkill=$("#f-skill"), fKind=$("#f-kind");
TAX.forEach(s=>fSkill.append(el("option",{value:s.id},s.name)));
function fillKinds(){fKind.replaceChildren(...TAX.find(s=>s.id===fSkill.value).kinds.map(k=>el("option",{value:k.id},k.name)))}
fSkill.addEventListener("change",fillKinds);
document.querySelectorAll("[data-upload]").forEach(b=>b.addEventListener("click",()=>{
  const sk=b.dataset.upload||filt.skill||"tests"; fSkill.value=sk; fillKinds(); if(!b.dataset.upload&&filt.kind)fKind.value=filt.kind;
  $("#codePanel").hidden=true; $("#uploadForm").hidden=false; window.scrollTo(0,0); $("#f-title").focus();
}));
$("#f-cancel").addEventListener("click",()=>{$("#uploadForm").hidden=true});
$("#uploadForm").addEventListener("submit",async e=>{
  e.preventDefault(); const st=$("#f-status"), btn=$("#f-submit"); st.className="status";
  const title=$("#f-title").value.trim(), link=$("#f-link").value.trim();
  const fe=$("#f-exam").files[0], fk=$("#f-key").files[0], fa=$("#f-audio").files[0];
  if(!title){st.className="status err";st.textContent="Cần nhập tiêu đề.";return}
  if(link&&!safeLink(link)){st.className="status err";st.textContent="Link phải bắt đầu bằng http:// hoặc https://";return}
  if(!fe&&!fk&&!fa&&!link){st.className="status err";st.textContent="Cần chọn ít nhất một tệp hoặc dán link.";return}
  btn.disabled=true;
  try{
    const row={title,topic:$("#f-topic").value.trim(),skill:fSkill.value,kind:fKind.value,level:$("#f-level").value,descr:$("#f-desc").value.trim(),
      link:link||null,show_answers:$("#f-show").checked,exam:null,answer:null,audio:null};
    if(fa)row.audio=await storeFile(fa,st,"File nghe");
    if(fe)row.exam=await storeFile(fe,st,"Tệp đề");
    if(fk)row.answer=await storeFile(fk,st,"Tệp đáp án");
    st.textContent="Đang lưu…";
    const {error}=await sb.from("ca_items").insert(row);
    if(error)throw{message:"Lưu không được: "+error.message};
    st.className="status ok";st.textContent="Đã đăng.";
    ["#f-title","#f-topic","#f-desc","#f-link"].forEach(s=>$(s).value="");["#f-exam","#f-key","#f-audio"].forEach(s=>$(s).value="");
    await refresh();
  }catch(err){st.className="status err";st.textContent=(err&&err.message)||"Đăng không thành công, thử lại."}
  finally{btn.disabled=false}
});

/* ---------- code manager (teacher) ---------- */
$("#codeBtn").addEventListener("click",()=>{$("#uploadForm").hidden=true;$("#codePanel").hidden=false;$("#curCode").textContent=settings?settings.code:"—";window.scrollTo(0,0)});
$("#closeCode").addEventListener("click",()=>{$("#codePanel").hidden=true});
$("#copyCode").addEventListener("click",e=>copyText(settings?settings.code:"",e.currentTarget));
$("#genCode").addEventListener("click",()=>{$("#newCode").value=rand(6,"ABCDEFGHJKLMNPQRSTUVWXYZ23456789")});
$("#rotateForm").addEventListener("submit",async e=>{
  e.preventDefault(); const st=$("#rotateStatus"), btn=$("#rotateBtn"); const code=norm($("#newCode").value);
  if(!/^[A-Z0-9-]{4,24}$/.test(code)){st.className="status err";st.textContent="Mã gồm 4–24 ký tự: chữ không dấu, số hoặc dấu gạch ngang.";return}
  if(code===settings.code){st.className="status err";st.textContent="Mã mới trùng mã cũ.";return}
  btn.disabled=true; st.className="status";
  try{
    /* 1. Khoá mã cũ ngay, giữ thư mục cũ trong lúc chuyển file */
    const np=rand(32);
    let r=await sb.from("ca_settings").update({code,updated_at:new Date().toISOString()}).eq("id",1);
    if(r.error)throw r.error;
    settings.code=code; $("#curCode").textContent=code;
    /* 2. Chuyển file sang thư mục mới để đường dẫn cũ không dùng được nữa */
    const {data:rows,error}=await sb.from("ca_items").select("*"); if(error)throw error;
    let i=0;
    for(const it of rows){
      i++; st.textContent=`Đang đổi đường dẫn tệp ${i}/${rows.length}…`;
      const upd={};
      for(const col of ["exam","answer","audio"]){
        const f=it[col]; if(!f||!f.path)continue;
        const to=np+"/"+f.path.split("/").pop();
        if(f.path!==to){const mv=await sb.storage.from(BUCKET).move(f.path,to);if(mv.error)throw mv.error}
        upd[col]={...f,path:to};
      }
      if(Object.keys(upd).length){r=await sb.from("ca_items").update(upd).eq("id",it.id);if(r.error)throw r.error}
    }
    r=await sb.from("ca_settings").update({prefix:np}).eq("id",1); if(r.error)throw r.error;
    settings.prefix=np; $("#newCode").value="";
    st.className="status ok"; st.textContent=`Đã đổi mã thành ${code}. Gửi mã mới cho học sinh.`;
    await refresh();
  }catch(err){st.className="status err";st.textContent="Đổi mã chưa xong: "+(err.message||"thử lại")+". Bấm Đổi mã lần nữa với cùng mã mới để làm tiếp."}
  finally{btn.disabled=false}
});

/* ---------- Luyện đề ---------- */
const MCQ=[
 {n:16,q:"Although many people don’t consider it harmful, alcohol is the __________ in the United States.",o:["drug commonly abused most","most commonly abused drug","most abused commonly drug","commonly most abused drug"],a:1,e:"Trật tự: the + most + trạng từ (commonly) + phân từ (abused) + danh từ (drug)."},
 {n:17,q:"Physically, I __________ my mother, but my sister does not look anything like her.",o:["run into","let down","take after","hold up"],a:2,e:"take after = giống (người lớn tuổi trong gia đình)."},
 {n:18,q:"Each of us should be allowed to pursue our own interests __________ what our sex is.",o:["regardless of","prior to","because of","owing to"],a:0,e:"regardless of = bất kể."},
 {n:19,q:"The new regulations were introduced to prevent the __________ exploitation of natural resources.",o:["reluctant","temporary","cautious","excessive"],a:3,e:"excessive exploitation = khai thác quá mức."},
 {n:20,q:"Had the government implemented the proposed reforms a decade ago, the economy __________ far more resilient today.",o:["had been","would have been","will be","would be"],a:3,e:"Câu điều kiện hỗn hợp: Had + S + V3 (quá khứ) → kết quả ở hiện tại (today): would + V."},
 {n:21,q:"We can __________ the problem of space by building an extension.",o:["turn up","put off","pass away","get round"],a:3,e:"get round a problem = tìm cách giải quyết vấn đề."},
 {n:22,q:"The committee recommended that the report __________ before being submitted to the board.",o:["be revised","is revised","revised","was revised"],a:0,e:"Giả định cách: recommend that + S + (should) + V nguyên mẫu → be revised."},
 {n:23,q:"Your painting stands a good __________ of winning the prize.",o:["possibility","opportunity","certainty","chance"],a:3,e:"stand a good chance of doing sth = có nhiều khả năng."},
 {n:24,q:"The researcher __________ work on climate adaptation has received international recognition will deliver the keynote speech.",o:["whom","whose","which","that"],a:1,e:"whose + danh từ (work) chỉ sở hữu."},
 {n:25,q:"Snow is still falling __________, so the MET Office is advising people to stay at home.",o:["cats and dogs","chalk and cheese","thick and fast","skin and bone"],a:2,e:"thick and fast = dồn dập, liên tục."}
];
const WF=[
 {n:26,w:"SLIGHT",a:["slightly"],e:"Trạng từ bổ nghĩa cho động từ “bow”."},
 {n:27,w:"RELATION",a:["relationship"],e:"Sau tính từ “perceived” cần danh từ: relationship."},
 {n:28,w:"GREET",a:["greeting"],e:"Sau tính từ “basic” cần danh từ: greeting."},
 {n:29,w:"HOSPITABLE",a:["hospitality"],e:"Sau “a strong sense of” cần danh từ: hospitality."},
 {n:30,w:"APPROPRIATE",a:["inappropriate"],e:"Nghĩa phủ định: không nên đến nhà khi chưa được mời."}
];
function renderQuiz(){
  const f=$("#quiz"); f.replaceChildren();
  f.append(el("div",{class:"part-title",text:"Part 1. Câu 16–25: chọn đáp án A, B, C hoặc D"}));
  MCQ.forEach(it=>{
    const q=el("div",{class:"q",id:"q"+it.n},el("span",{class:"num",text:it.n+"."}),el("div",{text:it.q}));
    const opts=el("div",{class:"opts"});
    it.o.forEach((o,i)=>opts.append(el("label",{class:"opt"},el("input",{type:"radio",name:"m"+it.n,value:String(i),id:`m${it.n}-${i}`}),el("span",{},el("b",{text:"ABCD"[i]+". "}),o))));
    q.append(opts); f.append(q);
  });
  f.append(el("div",{},el("div",{class:"part-title",text:"Part 2. Câu 26–30: viết dạng đúng của từ in hoa"}),el("p",{class:"part-note",text:"Câu (0) đã làm mẫu: PART → parting."})));
  const inp=n=>el("input",{id:"w"+n,autocomplete:"off",spellcheck:"false","aria-label":"Câu "+n}), tag=n=>el("span",{class:"tag",text:`(${n}) `});
  f.append(el("div",{class:"passage"},"Vietnamese people generally shake hands when greeting and parting. Women are more likely to bow their head ",tag(26),inp(26)," than to shake hands. People address one another by their given names, but add a title that indicates their perceived ",tag(27),inp(27)," to the other person. A basic ",tag(28),inp(28)," combined with the given name and the title is Xin chao (Hello). Vietnamese have a strong sense of ",tag(29),inp(29)," and feel embarrassed if they cannot show their guests full respect by preparing for their arrival. Therefore, it is ",tag(30),inp(30)," to visit a home without having been invited."));
  f.append(el("div",{class:"given"},"Từ cho sẵn:",WF.map(w=>el("span",{text:`(${w.n}) ${w.w}`}))));
  f.append(el("div",{id:"wfExpl"}));
  f.append(el("div",{class:"acts"},el("button",{class:"btn primary",type:"submit"},"Nộp bài"),el("button",{class:"btn",type:"button",onclick:()=>{$("#result").hidden=true;renderQuiz();window.scrollTo(0,0)}},"Làm lại")));
}
$("#quiz").addEventListener("submit",e=>{
  e.preventDefault(); let right=0; const wrong=[];
  MCQ.forEach(it=>{
    const box=$("#q"+it.n); box.querySelectorAll(".expl").forEach(x=>x.remove());
    const c=box.querySelector("input:checked"); const v=c?+c.value:-1;
    box.querySelectorAll(".opt").forEach((o,i)=>{o.classList.toggle("right",i===it.a);o.classList.toggle("wrong",i===v&&v!==it.a)});
    const ok=v===it.a; if(ok)right++; else wrong.push(it.n);
    box.append(el("div",{class:"expl "+(ok?"ok":"no")},el("b",{text:(ok?"Đúng. ":v<0?"Chưa chọn. ":"Chưa đúng. ")+"Đáp án "+"ABCD"[it.a]+". "}),it.e));
  });
  const ex=$("#wfExpl"); ex.replaceChildren();
  WF.forEach(w=>{const i=$("#w"+w.n);const ok=w.a.includes(i.value.trim().toLowerCase());i.classList.toggle("right",ok);i.classList.toggle("wrong",!ok);if(ok)right++;else wrong.push(w.n);
    ex.append(el("div",{class:"q"},el("span",{class:"num",text:w.n+"."}),el("div",{class:"expl "+(ok?"ok":"no")},el("b",{text:(ok?"Đúng: ":"Đáp án: ")+w.a[0]+". "}),w.e)))});
  const total=MCQ.length+WF.length; const r=$("#result"); r.hidden=false;
  r.replaceChildren(el("div",{class:"big",text:`${right}/${total}`}),el("div",{},el("b",{text:`${(right*0.1).toFixed(1)} / 1.5 điểm`}),el("div",{class:"muted",text:wrong.length?"Câu cần xem lại: "+wrong.join(", "):"Làm đúng tất cả. Rất tốt!"})));
  window.scrollTo({top:0});
});

/* ================= Start ================= */
renderQuiz();
(async()=>{
  if(!sb){showGate("Web chưa được kết nối Supabase. Điền địa chỉ và khoá vào file config.js (xem README).","none");return}
  const {data:{session}}=await sb.auth.getSession();
  if(session){await startTeacher();if(isEditor)return}
  const saved=store.get("mst-code");
  if(saved){try{items=await fetchStudent(saved);studentCode=saved;loading=false;enterApp();return}catch(err){if(err.message==="invalid")store.del("mst-code")}}
  showGate("Nhập mã truy cập cô Trâm gửi để vào kho tài liệu.","code");
})();
