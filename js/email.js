
// EmailJS basic init + form handler
// 1) Replace EMAILJS_PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID in config below.
const EMAILJS_PUBLIC_KEY = "REEMPLAZAR_PUBLIC_KEY";
const SERVICE_ID = "REEMPLAZAR_SERVICE_ID";
const TEMPLATE_ID = "REEMPLAZAR_TEMPLATE_ID";

function initEmailJS(){
  if(window.emailjs && EMAILJS_PUBLIC_KEY !== "REEMPLAZAR_PUBLIC_KEY"){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
}

async function handleContactSubmit(e){
  e.preventDefault();
  const form = e.target;
  const data = {
    from_name: form.name.value.trim(),
    reply_to: form.email.value.trim(),
    message: form.message.value.trim(),
  };
  const btn = form.querySelector("button[type=submit]");
  const prev = btn.textContent;
  btn.disabled = true; btn.textContent = "Enviando...";

  try{
    if(!window.emailjs){ throw new Error("EmailJS no cargó"); }
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, data);
    form.reset();
    alert("¡Mensaje enviado! Te responderemos pronto.");
  }catch(err){
    console.error(err);
    alert("No se pudo enviar el mensaje. Revisa tu configuración de EmailJS.");
  }finally{
    btn.disabled = false; btn.textContent = prev;
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  initEmailJS();
  const form = document.getElementById("contactForm");
  if(form){ form.addEventListener("submit", handleContactSubmit); }
});


async function handleQuoteSubmit(e){
  e.preventDefault();
  const form = e.target;
  const data = {
    from_name: form.name.value.trim(),
    reply_to: form.email.value.trim(),
    message: form.message.value.trim(),
    product: form.product.value
  };
  try{
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, data);
    alert("¡Cotización enviada!");
    form.reset();
  }catch(err){
    console.error(err);
    alert("Error enviando la cotización.");
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  const qform = document.getElementById("quoteForm");
  if(qform){ qform.addEventListener("submit", handleQuoteSubmit); }
});
