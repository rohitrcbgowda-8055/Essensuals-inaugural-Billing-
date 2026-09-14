ESSENSUALS BILLING - LOCAL PDF VERSION

This version does NOT depend on jsPDF or any external JavaScript CDN for PDF creation.

Buttons:
- Print Bill: browser print dialog.
- Save Bill PDF: creates and downloads a PDF locally.
- New Bill: clears the form after confirmation and creates a new invoice number.
- Send PDF on WhatsApp: shows a clear setup status until the WhatsApp Worker URL is configured.

To connect WhatsApp:
1. Deploy worker.js as a Cloudflare Worker.
2. Add WHATSAPP_TOKEN, PHONE_NUMBER_ID, and ALLOWED_ORIGIN as Worker secrets/variables.
3. Replace YOUR_WORKER_URL in index.html with the Worker endpoint.
4. WhatsApp Business/Meta may require an approved template for outbound messages outside the 24-hour customer-service window.

Do not put the WhatsApp access token in index.html.
