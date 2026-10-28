(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const root = document.documentElement;
  const themeButton = $('#themeToggle');
  const themeMeta = $('#themeMeta');
  const menuButton = $('#menuToggle');
  const mobileMenu = $('#mobileNav');
  const form = $('#enquiryForm');
  const productSelect = $('#customerProduct');
  const status = $('#formFeedback');
  const config = window.MIZBERY_CONFIG || {};
  const whatsapp = String(config.whatsapp || '').replace(/\D/g,'');
  const email = String(config.email || '').trim();
  const phone = String(config.phone || '').trim();

  function updateTheme() {
    const dark = root.dataset.theme === 'dark';
    themeButton?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton?.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeMeta?.setAttribute('content', dark ? '#000000' : '#ffffff');
  }
  updateTheme();
  themeButton?.addEventListener('click',() => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('mizbery-theme',root.dataset.theme); } catch(e) {}
    updateTheme();
  });

  // Follow changes in OS theme unless the visitor manually chose a theme.
  const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
  colorPreference.addEventListener?.('change', (event) => {
    let saved = null;
    try { saved = localStorage.getItem('mizbery-theme'); } catch(e) {}
    if(saved !== 'dark' && saved !== 'light') {
      root.dataset.theme = event.matches ? 'dark' : 'light';
      updateTheme();
    }
  });

  function closeMenu() {
    menuButton?.setAttribute('aria-expanded','false');
    menuButton?.setAttribute('aria-label','Open menu');
    if (mobileMenu) mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  }
  menuButton?.addEventListener('click',()=>{
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded',String(opening));
    menuButton.setAttribute('aria-label',opening?'Close menu':'Open menu');
    mobileMenu.hidden = !opening;
    document.body.classList.toggle('menu-open', opening);
  });
  $$('#mobileNav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{
    if(e.key === 'Escape' && menuButton?.getAttribute('aria-expanded')==='true') {
      closeMenu();menuButton.focus();
    }
  });
  window.addEventListener('resize',()=>{ if(window.innerWidth > 800) closeMenu(); },{passive:true});

  const direct = $('#directDetails');
  if(direct) {
    if(phone){const a=document.createElement('a');a.href='tel:'+phone.replace(/[^+\d]/g,'');a.textContent='Call: '+phone;direct.append(a);}
    if(email){const a=document.createElement('a');a.href='mailto:'+email;a.textContent=email;direct.append(a);}
    if(whatsapp){const a=document.createElement('a');a.href='https://wa.me/'+whatsapp;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Chat on WhatsApp ↗';direct.append(a);}
  }
  const submitText = $('#submitText');
  if(submitText) submitText.textContent = 'Enquiry now';

  function goToEnquiry(product) {
    if(productSelect) productSelect.value=product;
    if(status){status.textContent='';status.classList.remove('error');}
    $('#contact')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }
  $$('[data-enquire]').forEach(button=>button.addEventListener('click',()=>goToEnquiry(button.dataset.enquire)));
  $('[data-wholesale-link]')?.addEventListener('click',()=>{if(productSelect)productSelect.value='Recurring wholesale supply';});

  function showEnquiryAnimation(title,message){
    const box=$('#enquiryAnimation');
    if(!box)return;
    $('#enquiryAnimationTitle').textContent=title;
    $('#enquiryAnimationMessage').textContent=message;
    box.hidden=false;
    box.style.animation='none';void box.offsetWidth;box.style.animation='';
  }
  function setStatus(message,error=false){
    if(!status)return;
    status.textContent=message;
    status.classList.toggle('error',error);
  }
  async function copyText(text) {
    if(navigator.clipboard && window.isSecureContext){try {await navigator.clipboard.writeText(text);return true;}catch(e){}}
    const field=document.createElement('textarea');field.value=text;field.style.position='fixed';field.style.top='-10000px';field.style.opacity='0';document.body.append(field);field.select();
    let copied=false;try{copied=document.execCommand('copy');}catch(e){}field.remove();
    if(!copied){
      const box=document.createElement('textarea');box.id='copyFallback';box.value=text;box.readOnly=true;box.rows=7;box.style.width='100%';box.style.marginTop='12px';status.after(box);box.focus();box.select();
    }
    return copied;
  }
  function validateField(id,label,checker){
    const elem=$(id);if(!elem)return true;
    const valid=checker(elem.value.trim());elem.classList.toggle('invalid',!valid);
    elem.setAttribute('aria-invalid',String(!valid));
    if(!valid){setStatus('Please enter a valid '+label+'.',true);elem.focus();}
    return valid;
  }
  $$('#enquiryForm input, #enquiryForm textarea, #enquiryForm select').forEach(el=>{
    el.addEventListener('input',()=>{el.classList.remove('invalid');el.removeAttribute('aria-invalid');});
  });
  form?.addEventListener('submit',async e=>{
    e.preventDefault();
    $('#copyFallback')?.remove();
    setStatus('');
    if($('#enquiryAnimation')) $('#enquiryAnimation').hidden=true;
    if(!validateField('#customerName','name',v=>v.length>=2))return;
    if(!validateField('#customerPhone','phone number',v=>v.replace(/\D/g,'').length>=7&&v.replace(/\D/g,'').length<=15))return;
    const fd=new FormData(form);
    const val=k=>String(fd.get(k)||'').trim();
    const lines=[
      'Hello Mizbery,',
      '',
      'I would like to enquire about your packaged drinking water.',
      '',
      'Name: '+val('name'),
      'Phone: '+val('phone'),
      'Interested in: '+val('product'),
      val('quantity')?'Estimated quantity: '+val('quantity'):null,
      val('location')?'Location: '+val('location'):null,
      val('message')?'Message: '+val('message'):null,
    ].filter(v=>v!==null);
    const message=lines.join('\n');
    if(whatsapp){
      const url='https://wa.me/'+whatsapp+'?text='+encodeURIComponent(message);
      window.open(url,'_blank','noopener,noreferrer');
      setStatus('WhatsApp has been opened with your enquiry. Tap Send there to submit it.');
      showEnquiryAnimation('Enquiry ready','Review and send your message in WhatsApp.');
    }else if(email){
      const subject=encodeURIComponent('Mizbery enquiry — '+val('product'));
      window.location.href='mailto:'+encodeURIComponent(email)+'?subject='+subject+'&body='+encodeURIComponent(message);
      setStatus('Your email app should open. Tap Send there to submit your enquiry.');
      showEnquiryAnimation('Enquiry ready','Review and send your email to finish.');
    }else{
      const copied=await copyText(message);
      setStatus(copied?'Enquiry copied. Configure Mizbery’s email or WhatsApp in js/config.js to enable direct sending.':'Select and copy your enquiry from the text box below. Configure Mizbery’s contact to enable direct sending.',!copied);
      if(copied)showEnquiryAnimation('Enquiry prepared','Your details have been copied; they have not been sent yet.');
    }
  });
  $('#year').textContent = new Date().getFullYear();
})();
