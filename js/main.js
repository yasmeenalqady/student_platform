document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.querySelector('.navbar');
 window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>20));
 const menuBtn=document.querySelector('#menuBtn'), mobile=document.querySelector('#mobileMenu');
 menuBtn?.addEventListener('click',()=>mobile.classList.toggle('open'));
 const revealTargets=document.querySelectorAll('main > section:not(.hero-banner),.service-card,.portfolio-card,.demand-card,.process-card');
 if('IntersectionObserver' in window){
   const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
     if(!entry.isIntersecting)return;
     entry.target.classList.add('is-visible');
     revealObserver.unobserve(entry.target);
   }),{threshold:.12,rootMargin:'0px 0px -40px'});
   revealTargets.forEach((element,index)=>{
     element.classList.add('scroll-reveal');
     element.style.setProperty('--reveal-delay',`${Math.min(index%6,5)*70}ms`);
     revealObserver.observe(element);
   });
 }else revealTargets.forEach(element=>element.classList.add('is-visible'));
 const portfolioGrid=document.querySelector('#portfolioGrid');
 if(portfolioGrid){
   const portfolioAssets=[
    ...Array.from({length:10},(_,index)=>({category:'مشاريع',title:`مشروع ${index+1}`,desc:'مشروع احترافي من أعمالنا.',type:'image',src:`image/project/${index+1}.JPG.jpeg`})),
    ...[1,2,3,4,5,6,7,10,11].map((number,index)=>({category:'جرافيك',title:`تصميم ${index+1}`,desc:'تصميم إبداعي من أعمالنا.',type:'image',src:`image/desgin/${number}.jpeg`})),
     ...Array.from({length:3},(_,index)=>({category:'فيديو',title:`فيديو ${index+1}`,desc:'محتوى مرئي من أعمالنا.',type:'video',src:`image/video/${index+1}.mp4`}))
   ];
   portfolioGrid.innerHTML=portfolioAssets.map(asset=>`<article class="portfolio-card cursor-pointer overflow-hidden rounded-2xl border" data-category="${asset.category}" data-desc="${asset.desc}" data-project="" data-title="${asset.title}">${asset.type==='video'?`<video class="w-full h-64 object-cover" autoplay muted loop playsinline src="${asset.src}"></video>`:`<img alt="${asset.title}" class="w-full h-64 object-cover" src="${asset.src}"/>`}<div class="p-5"><span class="text-gold text-sm">${asset.category}</span><h2 class="font-black mt-1">${asset.title}</h2><p class="text-muted text-sm mt-2">اضغط لمشاهدة التفاصيل</p></div></article>`).join('');
 }
 const portfolioItemsPerPage=6;
 function updatePortfolioPagination(){
   const pagination=document.querySelector('#pagination');
   const grid=document.querySelector('#portfolioGrid');
   if(!pagination||!grid)return;
   const cards=[...grid.querySelectorAll('[data-category]')];
   const currentFilter=document.querySelector('.filter-btn.active')?.dataset.filter||'all';
   const filteredCards=cards.filter(card=>currentFilter==='all'||card.dataset.category===currentFilter);
   const totalPages=Math.max(1,Math.ceil(filteredCards.length/portfolioItemsPerPage));
   const currentPage=Math.min(Math.max(Number(pagination.dataset.page||1),1),totalPages);
   pagination.dataset.page=String(currentPage);
   cards.forEach(card=>card.style.display='none');
   filteredCards.forEach((card,index)=>{
     const page=Math.floor(index/portfolioItemsPerPage)+1;
     card.style.display=page===currentPage?'block':'none';
   });
   pagination.innerHTML='';
   const prevBtn=document.createElement('button');
   prevBtn.type='button'; prevBtn.textContent='السابق'; prevBtn.className='pagination-btn';
   prevBtn.disabled=currentPage===1;
   prevBtn.addEventListener('click',()=>{
     pagination.dataset.page=String(Math.max(1,currentPage-1));
     updatePortfolioPagination();
   });
   pagination.appendChild(prevBtn);
   for(let i=1;i<=totalPages;i++){
     const pageBtn=document.createElement('button');
     pageBtn.type='button'; pageBtn.textContent=i; pageBtn.className='pagination-btn'+(i===currentPage?' active':'');
     pageBtn.addEventListener('click',()=>{
       pagination.dataset.page=String(i); updatePortfolioPagination();
     });
     pagination.appendChild(pageBtn);
   }
   const nextBtn=document.createElement('button');
   nextBtn.type='button'; nextBtn.textContent='التالي'; nextBtn.className='pagination-btn';
   nextBtn.disabled=currentPage===totalPages;
   nextBtn.addEventListener('click',()=>{
     pagination.dataset.page=String(Math.min(totalPages,currentPage+1));
     updatePortfolioPagination();
   });
   pagination.appendChild(nextBtn);
 }
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
   const group=btn.closest('.filter-group'); group.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
   const target=btn.dataset.filter; const grid=document.querySelector(btn.dataset.target);
   if(grid){
     grid.querySelectorAll('[data-category]').forEach(item=>{item.style.display='none';});
   }
   document.querySelector('#pagination')?.setAttribute('data-page','1');
   updatePortfolioPagination();
 }));
 updatePortfolioPagination();
 document.querySelectorAll('[data-project]').forEach(card=>card.addEventListener('click',()=>{
   const m=document.querySelector('#projectModal'); if(!m)return;
   m.querySelector('[data-modal-title]').textContent=card.dataset.title;
   m.querySelector('[data-modal-category]').textContent=card.dataset.category;
   m.querySelector('[data-modal-desc]').textContent=card.dataset.desc;
  const media=card.querySelector('img,video');
  const modalImage=m.querySelector('[data-modal-img]');
  if(media?.tagName==='VIDEO'){modalImage.src='';modalImage.poster='';modalImage.closest('div')?.classList.add('hidden');}else{modalImage.src=media?.src||'';modalImage.closest('div')?.classList.remove('hidden');}
  m.classList.add('show');document.body.style.overflow='hidden';
 }));
 document.querySelectorAll('.results-card img').forEach(img=>{
   img.style.cursor='pointer';
   img.addEventListener('click',()=>{
     const modal=document.querySelector('#resultsModal');
     if(!modal)return;
     const target=modal.querySelector('[data-modal-image]');
     target.src=img.src;
     target.alt=img.alt||'صورة المشروع';
     modal.classList.add('show');
     document.body.style.overflow='hidden';
   });
 });
 document.querySelectorAll('[data-close-modal]').forEach(x=>x.addEventListener('click',()=>{
   const modal=x.closest('.modal');
   if(modal){modal.classList.remove('show');}
   document.body.style.overflow='';
 }));
 document.querySelectorAll('.modal').forEach(modal=>modal.addEventListener('click',event=>{
   if(event.target===modal){
     modal.classList.remove('show');
     document.body.style.overflow='';
   }
 }));
 document.querySelector('#contactForm')?.addEventListener('submit',e=>{
   e.preventDefault(); const form=e.target;
   if(!form.checkValidity()){form.reportValidity();return}
   document.querySelector('#successModal').classList.add('show');form.reset();
 });
});