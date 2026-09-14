# ESSENSUALS Billing — WhatsApp PDF

This package adds direct PDF bill sending through WhatsApp Business Cloud API.

## 1. Front end
Upload `index.html` to the root of your GitHub Pages repository.

In `index.html`, replace:

`https://YOUR_WORKER_URL/send-bill`

with your deployed Worker URL, for example:

`https://essensuals-whatsapp.your-subdomain.workers.dev/send-bill`

## 2. Backend
`worker.js` is a Cloudflare Worker. Deploy it and configure these Worker secrets:

- `WHATSAPP_TOKEN`
- `PHONE_NUMBER_ID`
- `ALLOWED_ORIGIN` = your GitHub Pages origin

Do NOT put the WhatsApp token in `index.html`.

## 3. WhatsApp Business setup
You need a Meta WhatsApp Business Platform / Cloud API setup with a business phone number and access token.

Important: WhatsApp's conversation policy can require an approved message template when the customer has not messaged the business recently. The included direct document payload is appropriate for an active customer-service conversation; otherwise configure an approved template with a document header and adapt the Worker payload.

## 4. What the button does
Customer phone -> browser creates PDF -> secure Worker receives PDF -> Worker uploads it to Meta -> WhatsApp sends the PDF directly to the customer's WhatsApp number.

No WhatsApp Desktop needs to open.

## 5. Test
First test with your own WhatsApp number. Do not publish your permanent access token in GitHub.
