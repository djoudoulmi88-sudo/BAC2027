import { supabase } from './supabaseClient.js'
import { createLink, loadLinks, removeLink } from './linkStore.js'

const subjects=[
 {id:'math',name:'الرياضيات',icon:'∑',cls:'math',about:'الدروس والتمارين والاختبارات'},
 {id:'physics',name:'الفيزياء',icon:'⚛',cls:'physics',about:'الدروس والتطبيقات والاختبارات'},
 {id:'science',name:'علوم الطبيعة والحياة',icon:'⌬',cls:'science',about:'الدروس والأنشطة والاختبارات'},
 {id:'islamic',name:'التربية الإسلامية',icon:'☾',cls:'islamic',about:'الدروس والمفاهيم والاختبارات'},
 {id:'history',name:'التاريخ والجغرافيا',icon:'◷',cls:'history',about:'الدروس والخرائط والاختبارات'},
 {id:'arabic',name:'اللغة العربية',icon:'ع',cls:'arabic',about:'النصوص والقواعد والاختبارات'},
 {id:'french',name:'اللغة الفرنسية',icon:'A',cls:'french',about:'الدروس والتعبير والاختبارات'},
 {id:'philosophy',name:'الفلسفة',icon:'◇',cls:'philosophy',about:'المقالات والمفاهيم والاختبارات'},
 {id:'english',name:'اللغة الإنجليزية',icon:'A',cls:'english',about:'الدروس والتعبير والاختبارات'}
];
const curriculum={
math:{units:[
 ['الدوال العددية','المجالات والاستمرارية والنهايات والاشتقاق، ثم دراسة تغيرات الدالة واستعمال المشتقة في حل المسائل.'],
 ['الدالتان الأسية واللوغاريتمية','تعريف الدالتين وخواصهما، النهايات، المعادلات والمتراجحات وتوظيفهما في النمذجة.'],
 ['المتتاليات العددية','المتتاليات الحسابية والهندسية، طرق تعريف المتتالية، الرتابة والتقارب والنهايات.'],
 ['الدوال الأصلية والحساب التكاملي','الدوال الأصلية، تعريف التكامل وخواصه، حساب المساحات وتطبيقات التكامل.'],
 ['الاحتمالات والأعداد المركبة والهندسة في الفضاء','الاحتمالات الشرطية والمتقطعة، الأعداد المركبة والتحويلات، والمتجهات والمستقيمات والمستويات.']
],quiz:[
 ['إذا كانت f قابلة للاشتقاق عند a، فماذا تمثل f′(a) هندسيًا؟',['ميل المماس للمنحنى عند a','مساحة محصورة','إحداثي نقطة التقاطع'],0],
 ['إذا كان u(n+1)=u(n)+3، فما نوع الزيادة؟',['هندسية أساسها 3','حسابية أساسها 3','ثابتة تساوي 3^n'],1],
 ['مشتقة دالة أصلية F هي:',['F','f','∫F'],1],
 ['إذا كان P(A)>0، فإن P(B|A) تساوي:',['P(A∩B)/P(A)','P(A)+P(B)','P(A)/P(B)'],0]
]},
physics:{units:[
 ['المتابعة الزمنية لتحول كيميائي','تتبع تقدم التفاعل، جدول التقدم، زمن نصف التفاعل وسرعة التحول.'],
 ['تطور جملة ميكانيكية','قوانين نيوتن، الحركة والتسارع، الحصيلة الطاقوية وتطبيقاتها.'],
 ['الظواهر الكهربائية','دارة RC وRL، المكثفة والوشيعة، الطاقة المخزنة والتطور الزمني للكمية الكهربائية.'],
 ['تطور جملة كيميائية والتحولات النووية','التوازن الكيميائي، التحولات النووية، مراقبة تحول كيميائي، الاهتزازات ومفهوم الموجة.']
],quiz:[
 ['زمن نصف التفاعل هو الزمن اللازم لبلوغ تقدم التفاعل:',['نصف التقدم النهائي','التقدم النهائي كاملًا','الصفر'],0],
 ['حسب القانون الثاني لنيوتن، محصلة القوى تساوي:',['m مضروبة في التسارع','الكتلة مقسومة على السرعة','الطاقة الحركية'],0],
 ['تُخزّن المكثفة الطاقة في:',['مجال كهربائي','مجال مغناطيسي','موجة صوتية'],0],
 ['عند التوازن الكيميائي، تكون سرعة التفاعل المباشر:',['مساوية لسرعة العكسي','منعدمة دائمًا','أكبر دائمًا'],0]
]},
science:{units:[
 ['تركيب البروتين','من المعلومة الوراثية إلى البروتين: الاستنساخ والترجمة ودور ARNm وARNt والشفرة الوراثية.'],
 ['بنية البروتين ووظيفته والتحفيز الأنزيمي','العلاقة بين البنية الفراغية والوظيفة، الموقع الفعال، نوعية الأنزيم والعوامل المؤثرة في نشاطه.'],
 ['الدفاع عن الذات والاتصال العصبي','الاستجابة المناعية النوعية والأجسام المضادة وLB، ثم كمون الراحة وكمون العمل وانتقال الرسالة العصبية.'],
 ['تحويل الطاقة والتكتونية العامة','التركيب الضوئي والتنفس الخلوي وإنتاج ATP، بنية الأرض والنشاط التكتوني.']
],quiz:[
 ['أين تتم ترجمة المعلومة الوراثية إلى سلسلة ببتيدية؟',['على مستوى الريبوزوم','داخل جهاز غولجي','في الغشاء النووي'],0],
 ['ترتبط نوعية الأنزيم أساسًا بـ:',['بنية موقعه الفعال','لون الركيزة','حجم الخلية فقط'],0],
 ['تنتج الأجسام المضادة أساسًا عن تمايز:',['الخلايا اللمفاوية B','الكريات الحمراء','الخلايا العصبية'],0],
 ['أين تتم التفاعلات الضوئية للتركيب الضوئي؟',['أغشية التيلاكويد','النواة','الميتوكوندريا'],0]
]},
islamic:{units:[
 ['القرآن الكريم والحديث الشريف','التلاوة الصحيحة، فهم المعنى، تفسير النصوص وتوظيف توجيهاتها في السلوك.'],
 ['العقيدة والفكر','أثر العقيدة الإسلامية في الحياة، التمييز بين الرسالات السماوية وبيان أفضليتها.'],
 ['الفقه وأصوله','مقاصد الشريعة ومصادر التشريع، وتطبيق الأحكام في المعاملات والأسرة والمال.'],
 ['السيرة والحضارة','تحليل خطبة حجة الوداع وحقوق الإنسان، والتعرف إلى أسس علاقة المسلمين بغيرهم.']
],quiz:[
 ['من أهداف دراسة الحديث الشريف:',['فهم دلالته والعمل بتوجيهاته','حفظ أسماء الرواة فقط','إهمال سياقه'],0],
 ['مقاصد الشريعة تعين على فهم:',['الغايات والحِكم من الأحكام','أسماء الكتب فقط','أحكام التجويد فقط'],0],
 ['من مصادر التشريع الإسلامي:',['القرآن الكريم والسنة النبوية','العادات وحدها','الرأي دون دليل'],0],
 ['تتناول خطبة حجة الوداع جملة من المبادئ منها:',['حقوق الإنسان وحرمة الدماء','أحكام التجارة الدولية فقط','قواعد النحو'],0]
]},
history:{units:[
 ['التاريخ: تشكل العالم بعد الحرب العالمية الثانية','معايير تشكل العالم، طبيعة العلاقات بين الكتلتين، استراتيجياتهما والانفراج الدولي.'],
 ['التاريخ: الثورة الجزائرية وبناء الدولة','استراتيجيتا الثورة داخليًا وخارجيًا، رد الاستعمار، قيام الدولة والاختيارات الكبرى لبنائها.'],
 ['التاريخ: التحرر وفلسطين','حركات التحرر في آسيا وإفريقيا وأمريكا اللاتينية، القضية الفلسطينية والحروب ومشاريع التسوية.'],
 ['الجغرافيا: المبادلات والقوة الاقتصادية','التصنيف بين الدول المتقدمة والنامية، أسواق الطاقة والغذاء، حركة الأموال والتكتلات الاقتصادية.'],
 ['الجغرافيا: السكان والاقتصاد الجزائري والبرازيل','العلاقة بين السكان والتنمية بشرق وجنوب شرق آسيا، الاقتصاد الجزائري، والتنمية ومشكلاتها في البرازيل.']
],quiz:[
 ['من ملامح الانتقال من الثنائية إلى القطبية الأحادية:',['تفكك الكتلة الشرقية','قيام الكتلتين من جديد','اختفاء المؤسسات الدولية'],0],
 ['من أهداف الثورة الجزائرية على المستوى الخارجي:',['كسب الدعم والتعريف بالقضية','إيقاف العمل السياسي','عزل الثورة عن العالم'],0],
 ['تتضمن دراسة أسواق الطاقة والغذاء تحليل:',['الإنتاج والتبادل والاستهلاك','الأدب والشعر','المناخ وحده'],0],
 ['يركز محور البرازيل على:',['التنمية وعوامل القوة والضعف ومشكلاتها','القطبية الثنائية','الثورة الجزائرية'],0]
]},
arabic:{units:[
 ['عصر الضعف: الشعر التعليمي ونثر الحركة العلمية','خصائص الشعر التعليمي، ازدهار التأليف، وتحليل النصوص أدبيًا وبلاغيًا.'],
 ['الأدب الحديث: شعر المهجر والنهضة','النزعة الإنسانية، التجديد الشعري، وموقف شعر النهضة من حضارة الغرب.'],
 ['الشعر السياسي والملتزم','النزعة القومية وقضايا التحرر، فلسطين والثورة الجزائرية في الشعر.'],
 ['الشعر الاجتماعي وقضايا العصر','تحليل القضايا الاجتماعية وخصائص الشعر الاجتماعي مع مراجعة البلاغة والنحو المقرر.']
],quiz:[
 ['من خصائص الشعر التعليمي في عصر الضعف:',['تقديم المعارف في قالب شعري','الاعتماد على الحوار المسرحي فقط','غياب الموضوع'],0],
 ['ترتبط النزعة الإنسانية في شعر المهجر بـ:',['الاهتمام بالإنسان وقضاياه','وصف الحروب فقط','التقيد بالشعر التعليمي'],0],
 ['الشعر الملتزم غالبًا يعبر عن:',['موقف من قضية عامة أو تحررية','موضوعات لغوية محضة','وصف الطبيعة وحده'],0],
 ['الاستعارة من مباحث:',['البلاغة','العروض فقط','الصرف فقط'],0]
]},
french:{units:[
 ['النصوص والوثائق التاريخية','كتابة نص إخباري موضوعي عن حدث تاريخي، ثم عرض الحدث مع تعليقات أو شهادات.'],
 ['حوار الأفكار','الدفاع عن وجهة نظر والإقناع، ثم عرض الرأي المقابل ومناقشة حججه.'],
 ['النداء','صياغة نداء يحث المتلقي على اتخاذ موقف أو القيام بعمل مدني.']
],quiz:[
 ['ما الذي يميز النص التاريخي الموضوعي؟',['الوقائع والتواريخ والصياغة المحايدة','الآراء الشخصية فقط','الحوارات الخيالية'],0],
 ['ماذا يعني تفنيد حجة في حوار الأفكار؟',['مناقشتها بحجج وأسباب','تكرار الرأي نفسه','سرد ذكرى'],0],
 ['ما الغاية الأساسية من النداء؟',['حث المتلقي على العمل','وصف منظر طبيعي','تلخيص رواية'],0]
]},
philosophy:{units:[
 ['السؤال بين المشكلة والإشكالية','تحليل السؤال، التمييز بين المشكلة والإشكالية، وبناء موقف فلسفي مدعم بالحجج.'],
 ['فلسفة العلوم','طبيعة المعرفة الرياضية والعلمية، دور العقل، والاستدلال والتحليل والتركيب.'],
 ['العلاقات بين الناس','الأنا والغير، الشعور بالغير، والتواصل أو الصراع في العلاقة الإنسانية.'],
 ['انطباق الفكر مع نفسه','مبادئ المنطق، الحدود والتصورات، التعريف، الاستدلال المباشر والقياس.']
],quiz:[
 ['الإشكالية الفلسفية تتميز عادة بأنها:',['تفتح أسئلة ومواقف متعددة','سؤال له جواب حسابي وحيد','معلومة محفوظة دون نقاش'],0],
 ['من مباحث فلسفة العلوم في البرنامج:',['المعرفة الرياضية والعلمية','قواعد الإملاء','تاريخ الشعر'],0],
 ['يدرس محور العلاقات بين الناس علاقة:',['الأنا بالغير','العدد بالمجهول','اللغة بالوزن الشعري'],0],
 ['القياس الحملي يندرج ضمن:',['الاستدلال غير المباشر','الاستدلال المباشر فقط','الاستعارة'],0]
]},
english:{units:[
 ['الوحدة 1: الكسب غير المشروع لا يدوم','أخلاقيات الأعمال: النزاهة والمسؤولية المهنية والتدقيق الاجتماعي وكتابة ميثاق أخلاقي.'],
 ['الوحدة 2: السلامة أولًا','الإعلان والمستهلك والسلامة، والتعبير عن الاحتمال باستعمال may وmight وcould وcan.'],
 ['الوحدة 3: قفزة عملاقة للبشرية','علم الفلك والنظام الشمسي، واستكشاف الفضاء وفوائده ومخاطره.'],
 ['الوحدة 4: نحن عائلة','المشاعر والعواطف، وصف التجارب ومقارنة السلوكيات بين الثقافات.']
],quiz:[
 ['ما موضوع الوحدة الأولى؟',['أخلاقيات الأعمال','النظام الشمسي','مشاعر الأسرة'],0],
 ['أي أداة modal تعبّر عن احتمال مستقبلي؟',['might','mustn’t','was'],0],
 ['على ماذا تركز الوحدة الثالثة؟',['الفلك والنظام الشمسي','سلامة المستهلك','التدقيق الاجتماعي'],0],
 ['في الجملة “She had finished before he arrived”، أي زمنين استُعملا؟',['الماضي التام والماضي البسيط','المضارع البسيط فقط','المستقبل التام'],0]
]}
};

const key='medadStudyLinks';let links=[];let currentUser=null;const cloudEnabled=Boolean(supabase);
function renderSubjects(q=''){const box=document.getElementById('subjects');box.innerHTML='';subjects.filter(s=>s.name.includes(q.trim())).forEach(s=>{const n=links.filter(l=>l.subject===s.id).length;const el=document.createElement('article');el.className=`subject ${s.cls}`;el.innerHTML=`<div class="subject-top"><div class="subject-icon">${s.icon}</div><span class="count">${n} رابط${n===1?'':'ات'}</span></div><h3>${s.name}</h3><p>${s.about}</p><div class="go">افتح المادة ←</div>`;el.onclick=()=>openSubject(s.id);box.appendChild(el)})}
function renderLinks(){const box=document.getElementById('linkList');document.getElementById('linkCount').textContent=links.length?`${links.length} رابط`:'مساحتك لمصادرك';if(!links.length){box.innerHTML='<div class="link-empty"><div><strong>مصادرك الدراسية في مكان واحد</strong><p>أضف روابط الشروحات والملخصات التي تساعدك في المراجعة.</p></div><button class="primary" onclick="openModal()">＋ أضف رابطًا</button></div>';return}box.innerHTML=`<div style="display:flex;justify-content:flex-start;margin-bottom:11px"><button class="primary" onclick="openModal()">＋ أضف رابطًا</button></div>`+links.slice().reverse().map(l=>{const s=subjects.find(x=>x.id===l.subject);return `<div style="display:flex;align-items:center;gap:10px;padding:11px 3px;border-top:1px solid #eff2ee"><span class="subject-icon ${s.cls}" style="width:34px;height:34px;font-size:14px">${s.icon}</span><div style="min-width:0;flex:1"><a href="${safe(l.url)}" target="_blank" rel="noopener" style="font-size:12px;color:#1f6652;font-weight:700;text-decoration:none">${escapeHtml(l.name)}</a><div class="quiet">${s.name}</div></div><button class="secondary delete-link" onclick="deleteLink('${escapeHtml(l.id)}')" aria-label="حذف الرابط">حذف</button></div>`}).join('')}
function openSubject(id){const s=subjects.find(x=>x.id===id),subjectLinks=links.filter(l=>l.subject===id),c=curriculum[id];document.getElementById('homeView').classList.remove('active');document.getElementById('detailView').classList.add('active');document.getElementById('detailContent').innerHTML=`<div class="detail-head ${s.cls}"><div class="subject-icon">${s.icon}</div><div><h1>${s.name}</h1><p>السنة الثالثة ثانوي · ${id==='math'||id==='physics'||id==='science'?'شعبة علوم تجريبية':'التعليم الجزائري'}</p></div><button class="primary" style="margin-right:auto" onclick="openModal('${id}')">＋ أضف رابطًا</button></div><div class="detail-sections"><section class="panel"><div class="panel-title"><h3>الدروس والمحاور</h3><span class="quiet">${c.units.length} محاور</span></div><div class="lesson-grid">${c.units.map((u,i)=>`<article class="lesson-card"><small>المحور ${i+1}</small><h4>${u[0]}</h4><p>${u[1]}</p><details><summary>أهداف التعلّم</summary><p>افهم المصطلحات والأفكار الأساسية، اربطها بأمثلة وتمارين، ثم راجع أسئلة الاختبار في هذه المادة.</p></details></article>`).join('')}</div></section><section class="panel"><div class="panel-title"><h3>اختبار قصير</h3><span class="quiet">${c.quiz.length} أسئلة</span></div><p class="quiet" style="margin-top:-7px">اختر إجابة لكل سؤال؛ يظهر التصحيح والنتيجة مباشرة.</p><div class="quiz-box" id="quiz-${id}"><h4>اختبار ${s.name}</h4>${c.quiz.map((q,i)=>`<div class="q-item" data-q="${i}"><p>${i+1}. ${q[0]}</p><div class="q-choices">${q[1].map((a,j)=>`<button onclick="answerQuiz('${id}',${i},${j},this)">${a}</button>`).join('')}</div></div>`).join('')}<div class="quiz-result" id="result-${id}"></div><button class="secondary" onclick="resetQuiz('${id}')">إعادة الاختبار</button></div><div class="panel-title" style="margin-top:20px"><h3>روابط المادة</h3><button class="quiz-action" onclick="openModal('${id}')">＋ أضف رابطًا</button></div>${subjectLinks.length?subjectLinks.map(l=>`<div style="display:flex;align-items:center;gap:8px;font-size:12px;padding:8px 0"><a href="${safe(l.url)}" target="_blank" rel="noopener" style="flex:1">${escapeHtml(l.name)}</a><button class="secondary delete-link" onclick="deleteLink('${escapeHtml(l.id)}')">حذف</button></div>`).join(''):'<div class="empty-note">أضف روابط الشروحات والملخصات التي تساعدك في مراجعة هذه المادة.</div>'}</section></div><p class="source-note">المحاور مرتبة وفق ملفات التدرجات السنوية المرفقة (2022–2023).</p>`;window.scrollTo({top:0,behavior:'smooth'})}
function answerQuiz(id,qi,choice,button){const c=curriculum[id],q=c.quiz[qi],row=button.closest('.q-item');if(row.dataset.done)return;row.dataset.done='1';const btns=row.querySelectorAll('button');btns[q[2]].classList.add('correct');btns[q[2]].dataset.chosen=choice===q[2]?'yes':'no';if(choice!==q[2]){button.classList.add('wrong');button.dataset.chosen='selected'}const done=document.querySelectorAll(`#quiz-${id} .q-item[data-done="1"]`).length;if(done===c.quiz.length){const score=[...document.querySelectorAll(`#quiz-${id} .q-item`)].filter((el,i)=>el.querySelectorAll('button')[c.quiz[i][2]].dataset.chosen==='yes').length;document.getElementById(`result-${id}`).textContent=`نتيجتك: ${score} من ${c.quiz.length} — ${score===c.quiz.length?'ممتاز!':score>=c.quiz.length/2?'أحسنت، راجع الإجابات غير الصحيحة.':'راجع المحاور ثم أعد المحاولة.'}`;}}
function resetQuiz(id){const box=document.getElementById(`quiz-${id}`);box.querySelectorAll('.q-item').forEach(row=>{delete row.dataset.done;row.querySelectorAll('button').forEach(b=>{b.classList.remove('correct','wrong');delete b.dataset.chosen})});document.getElementById(`result-${id}`).textContent=''}
function goHome(){document.getElementById('detailView').classList.remove('active');document.getElementById('homeView').classList.add('active')}
function openModal(id){if(cloudEnabled&&!currentUser){showToast('سجّل الدخول لحفظ روابطك في حسابك');openAuth();return}const sel=document.getElementById('linkSubject');sel.innerHTML=subjects.map(s=>`<option value="${s.id}" ${s.id===id?'selected':''}>${s.name}</option>`).join('');document.getElementById('modal').classList.add('open')}
function closeModal(){document.getElementById('modal').classList.remove('open')}
function safe(url){try{const u=new URL(url);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}}function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function showToast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.style.cssText='position:fixed;bottom:24px;right:50%;transform:translateX(50%);background:#18332d;color:white;padding:12px 18px;border-radius:12px;font-size:12px;z-index:10;box-shadow:0 8px 24px #0002';document.body.appendChild(t)}t.textContent=msg;t.style.display='block';clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.style.display='none',2600)}
async function refreshLinks(){try{links=await loadLinks(currentUser);renderSubjects(document.getElementById('search').value);renderLinks();if(document.getElementById('detailView').classList.contains('active')){const active=document.querySelector('.detail-head h1');const match=subjects.find(s=>s.name===active?.textContent);if(match)openSubject(match.id)}}catch(error){showToast(`تعذر تحميل الروابط: ${error.message}`)}}
function updateAccountUi(){const status=document.getElementById('authStatus'),avatar=document.getElementById('avatar'),signOut=document.getElementById('signOutBtn');status.textContent=currentUser?currentUser.email:(cloudEnabled?'سجّل الدخول للمزامنة':'حفظ محلي');avatar.textContent=currentUser?(currentUser.email?.[0]||'ط').toUpperCase():'ط';signOut.style.display=currentUser?'inline-block':'none';document.getElementById('authHint').textContent=currentUser?`تم تسجيل الدخول باسم ${currentUser.email}. روابطك محفوظة في حسابك.`:'سجّل الدخول لحفظ روابطك ومزامنتها بين أجهزتك.';document.getElementById('authSetupNote').style.display=cloudEnabled?'none':'block';document.getElementById('signInBtn').disabled=!cloudEnabled||Boolean(currentUser);document.getElementById('signUpBtn').disabled=!cloudEnabled||Boolean(currentUser)}
function openAuth(){updateAccountUi();document.getElementById('authModal').classList.add('open')}
async function handleAuth(action){if(!supabase)return;const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||password.length<8){showToast('أدخل بريدًا صحيحًا وكلمة مرور من 8 أحرف على الأقل');return}const button=document.getElementById(action==='signIn'?'signInBtn':'signUpBtn');button.disabled=true;try{const result=action==='signIn'?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password});if(result.error)throw result.error;if(action==='signUp'&&!result.data.session)showToast('تم إنشاء الحساب. راجع بريدك لتأكيده ثم سجّل الدخول.');else showToast(action==='signIn'?'تم تسجيل الدخول':'تم إنشاء الحساب');}catch(error){showToast(error.message||'تعذر إكمال العملية')}finally{updateAccountUi()}}
async function deleteLink(id){try{await removeLink(currentUser,id);await refreshLinks();showToast('تم حذف الرابط')}catch(error){showToast(error.message||'تعذر حذف الرابط')}}
document.getElementById('search').addEventListener('input',e=>renderSubjects(e.target.value));document.getElementById('cancelModal').onclick=closeModal;document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});document.getElementById('authOpen').onclick=openAuth;document.getElementById('closeAuth').onclick=()=>document.getElementById('authModal').classList.remove('open');document.getElementById('authModal').addEventListener('click',e=>{if(e.target.id==='authModal')e.target.classList.remove('open')});document.getElementById('signInBtn').onclick=()=>handleAuth('signIn');document.getElementById('signUpBtn').onclick=()=>handleAuth('signUp');document.getElementById('signOutBtn').onclick=async()=>{const {error}=await supabase.auth.signOut();if(error)showToast(error.message);else{document.getElementById('authModal').classList.remove('open');showToast('تم تسجيل الخروج')}};document.getElementById('saveLink').onclick=async()=>{const name=document.getElementById('linkName').value.trim(),url=safe(document.getElementById('linkUrl').value.trim()),subject=document.getElementById('linkSubject').value;if(!name||url==='#'){showToast('أدخل اسمًا ورابطًا صالحًا يبدأ بـ https://');return}try{await createLink(currentUser,{name,url,subject});document.getElementById('linkName').value='';document.getElementById('linkUrl').value='';closeModal();await refreshLinks();showToast('تم حفظ الرابط')}catch(error){showToast(error.message||'تعذر حفظ الرابط')}};
Object.assign(window,{openSubject,openModal,goHome,showToast,answerQuiz,resetQuiz,deleteLink});
if(supabase){supabase.auth.getSession().then(({data})=>{currentUser=data.session?.user||null;updateAccountUi();refreshLinks()});supabase.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;updateAccountUi();refreshLinks()})}else{updateAccountUi();refreshLinks()}
renderSubjects();renderLinks();
