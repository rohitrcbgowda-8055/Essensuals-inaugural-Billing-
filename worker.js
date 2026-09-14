// Cloudflare Worker: secure WhatsApp PDF sender.
// Set these secrets in the Worker environment:
// WHATSAPP_TOKEN = Meta permanent/system-user access token
// PHONE_NUMBER_ID = your WhatsApp Business phone number ID
// ALLOWED_ORIGIN = your GitHub Pages origin, e.g. https://rohitrcbgowda-8055.github.io
//
// IMPORTANT: For first-time/outbound customer messages, WhatsApp may require
// an approved template. If your business is inside the 24-hour customer-service
// window, a direct document message can be used.

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    if (request.method === "OPTIONS") return new Response("", {headers: cors(origin)});
    if (request.method !== "POST") return json({ok:false,error:"POST only"},400,origin);

    try {
      const form = await request.formData();
      const phone = String(form.get("phone") || "").replace(/\D/g,"");
      const name = String(form.get("customerName") || "");
      const invoice = String(form.get("invoice") || "");
      const pdf = form.get("pdf");

      if (!/^\d{10}$/.test(phone)) return json({ok:false,error:"Invalid Indian mobile number"},400,origin);
      if (!(pdf instanceof File)) return json({ok:false,error:"PDF missing"},400,origin);
      if (!env.WHATSAPP_TOKEN || !env.PHONE_NUMBER_ID) return json({ok:false,error:"WhatsApp Worker secrets are not configured"},500,origin);

      const graph = `https://graph.facebook.com/v23.0/${env.PHONE_NUMBER_ID}`;

      // Upload PDF to Meta.
      const uploadForm = new FormData();
      uploadForm.append("messaging_product","whatsapp");
      uploadForm.append("file",pdf,pdf.name || `ESSENSUALS-${invoice}.pdf`);
      uploadForm.append("type","application/pdf");
      const up = await fetch(`${graph}/media`, {
        method:"POST",
        headers:{Authorization:`Bearer ${env.WHATSAPP_TOKEN}`},
        body:uploadForm
      });
      const media = await up.json();
      if (!up.ok || !media.id) return json({ok:false,error:media.error?.message || "Media upload failed"},502,origin);

      // Direct document message. For messages outside the 24-hour service window,
      // replace this payload with your approved WhatsApp template payload.
      const payload = {
        messaging_product:"whatsapp",
        to:"91"+phone,
        type:"document",
        document:{
          id:media.id,
          filename:pdf.name || `ESSENSUALS-${invoice}.pdf`,
          caption:`Thank you for visiting TONI&GUY ESSENSUALS, ${name}. Invoice ${invoice}.`
        }
      };
      const send = await fetch(`${graph}/messages`, {
        method:"POST",
        headers:{
          Authorization:`Bearer ${env.WHATSAPP_TOKEN}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify(payload)
      });
      const result = await send.json();
      if (!send.ok || result.error) return json({ok:false,error:result.error?.message || "WhatsApp send failed"},502,origin);
      return json({ok:true,messageId:result.messages?.[0]?.id || null},200,origin);
    } catch (e) {
      return json({ok:false,error:e.message || "Unexpected error"},500,origin);
    }
  }
};

function cors(origin){
  return {
    "Access-Control-Allow-Origin":origin,
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
    "Access-Control-Max-Age":"86400"
  };
}
function json(data,status,origin){
  return new Response(JSON.stringify(data),{
    status,headers:{"Content-Type":"application/json",...cors(origin)}
  });
}