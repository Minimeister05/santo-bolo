'use strict';
const menuButton=document.querySelector('.menu-toggle');
const mobileMenu=document.getElementById('mobile-menu');
function closeMenu(){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');}
menuButton.addEventListener('click',()=>{const opened=menuButton.getAttribute('aria-expanded')==='true';mobileMenu.hidden=opened;menuButton.setAttribute('aria-expanded',String(!opened));menuButton.setAttribute('aria-label',opened?'Abrir menu':'Fechar menu');});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
window.matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const products=[...document.querySelectorAll('.product')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
 const category=button.dataset.filter;let count=0;
 products.forEach(product=>{const visible=category==='all'||product.dataset.category.split(' ').includes(category);product.hidden=!visible;if(visible)count++;});
 document.getElementById('flavor-count').textContent=count===1?'1 jeito de adoçar o dia':`${count} jeitos de adoçar o dia`;
}));
const occasions={cafe:{title:'Seu café merece companhia.',text:'Separe as xícaras, escolha um sabor e faça da pausa a melhor parte do dia.',action:'Escolher um bolo para o café',value:'Café da tarde'},presente:{title:'Um jeito doce de dizer: lembrei de você.',text:'Para agradecer, surpreender ou estar perto, mesmo de longe. Conte sua ideia e consulte as opções com a loja.',action:'Pensar em um presente',value:'Presente'},celebrar:{title:'Toda celebração merece uma boa fatia.',text:'Aniversário, reencontro ou uma pequena conquista. Conte a ocasião e planeje seu bolo com a equipe.',action:'Planejar uma comemoração',value:'Comemoração'}};
const tabs=[...document.querySelectorAll('[data-occasion]')];
function selectOccasion(tab){
 tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});
 const content=occasions[tab.dataset.occasion];const panel=document.getElementById('occasion-panel');
 panel.setAttribute('aria-labelledby',tab.id);panel.querySelector('h3').textContent=content.title;panel.querySelector('p').textContent=content.text;
 const action=document.getElementById('occasion-order');action.innerHTML=content.action+' <span>↗</span>';action.dataset.moment=content.value;
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectOccasion(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectOccasion(tabs[next]);tabs[next].focus();}});});
const dialog=document.getElementById('order-dialog');
const form=document.getElementById('order-form');
const flavor=document.getElementById('flavor');
const occasion=document.getElementById('occasion');
const date=document.getElementById('order-date');
const people=document.getElementById('people');
const notes=document.getElementById('order-notes');
const status=document.getElementById('form-status');
const preview=document.getElementById('message-preview');
let lastTrigger=null;
const now=new Date();date.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
function message(){
 const lines=['Olá, Santo Bolo! Gostaria de consultar uma encomenda.'];
 lines.push(`Sabor: ${flavor.value}.`,`Ocasião: ${occasion.value}.`);
 if(date.value){const [y,m,d]=date.value.split('-');lines.push(`Data desejada: ${d}/${m}/${y}.`);}
 if(people.value)lines.push(`Para aproximadamente ${people.value} pessoa${people.value==='1'?'':'s'}.`);
 if(notes.value.trim())lines.push(`Detalhes: ${notes.value.trim()}`);
 lines.push('Podem me informar as opções disponíveis, tamanhos e valores?');return lines.join('\n');
}
function updateMessage(){preview.textContent=message();status.textContent='Copie sua mensagem e envie pelo direct da loja.';}
form.addEventListener('input',updateMessage);form.addEventListener('change',updateMessage);
document.querySelectorAll('[data-order]').forEach(button=>button.addEventListener('click',()=>{
 lastTrigger=button;closeMenu();if(button.dataset.order)flavor.value=button.dataset.order;if(button.dataset.moment)occasion.value=button.dataset.moment;updateMessage();dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;
}));
function closeDialog(){dialog.close();}
document.getElementById('close-dialog').addEventListener('click',closeDialog);
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastTrigger?.focus();});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 try{await navigator.clipboard.writeText(message());status.textContent='Mensagem copiada! Agora abra o Instagram e cole no direct da Santo Bolo.';}
 catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(preview);selection.removeAllRanges();selection.addRange(range);status.textContent='Selecione e copie a mensagem acima; depois envie pelo direct da loja.';}
});
document.getElementById('year').textContent=new Date().getFullYear();
updateMessage();
