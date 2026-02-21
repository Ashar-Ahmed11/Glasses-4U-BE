const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post('/', async (req, res) => {
  try {
    // const transport = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: 'memonfoodsandspices@gmail.com',
    //     pass: 'ajikizflolrqazfw'
    //   }
    // })

    const transport = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,          // SSL port
      secure: true,       // true for port 465
      auth: {
        user: 'team@glasses-4u.com', // your GoDaddy email
        pass: 'karachi2020'  // email password or app password
      }
    });

    const {
      email,
      customerEmail,
      name,
      phone,
      address,
      city,
      country,
      postalCode,
      trackingId,
      status = 'Pending Approval',
      subtotal = 0,
      deliveryCharges = 0,
      total = 0,
      items = [],
    } = req.body || {}

    const fmtCurrency = (n) => Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    const escape = (s) => String(s || '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]))
    const fmtNum = (v, sign = true) => (typeof v === 'number' ? `${v >= 0 && sign ? '+' : ''}${v.toFixed(2)}` : 'None')
    const fmtAxis = (v) => (typeof v === 'number' ? `${v}` : 'None')
    const displayEmail = customerEmail || email
    const lensLabel = (lens) => {
      if (!lens) return 'None'
      const t = [lens.thickness ?? '', String(lens.title || '').toUpperCase()].join(' ').trim()
      const p = lens.price ? ` + ${fmtCurrency(Number(lens.price))}` : ''
      return `${t}${p}`
    }

    const itemsHTML = (items || []).map((it) => {
      const rx = it.prescription || null
      const singlePD = !(rx?.prescription?.hasTwoPD)
      const pdRight = singlePD ? (rx?.prescription?.pd ?? '') : (rx?.prescription?.pd?.right ?? '')
      const pdLeft = singlePD ? '' : (rx?.prescription?.pd?.left ?? '')
      const od = rx?.prescription?.od || {}
      const os = rx?.prescription?.os || {}
      const rxType = ({ distance: 'Distance', reading: 'Reading', bifocal: 'Bifocal with line', progressive: 'Progressive (no line)' }[rx?.rxType]) || '—'
      const lensType = ({ clear: 'Clear Lenses', photochromic: 'Photochromic - Dark in Sun', sunglasses: 'Sunglasses (Always Dark)' }[rx?.lensType]) || '—'
      const tint = rx?.tint || null
      return `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #eee;">
          <div style="display:flex; align-items:center; gap:14px;">
            <img src="${escape(it.image || '')}" alt="" style="width:88px; height:52px; object-fit:cover; border-radius:6px; border:1px solid #eee;" />
            <div style="flex:1; margin-left:12px;">
              <div style="font-weight:600; color:#111;">${escape(it.name)}</div>
              <div style="color:#666; font-size:12px;">
                Unit: ${fmtCurrency(it.unitPrice || it.price)}
                <span style="margin-left:8px;">Quantity: ${escape(it.quantity)}</span>
              </div>
            </div>
            <div style="font-weight:600; color:#111;">${fmtCurrency((it.unitPrice || it.price) * (it.quantity || 1))}</div>
          </div>
          ${rx ? `
            <div style="margin-top:10px; padding:10px; background:#f9fafb; border:1px solid #eee; border-radius:6px;">
              <div style="font-weight:600; margin-bottom:6px; color:#111;">Prescription</div>
              <div style="overflow:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:12px;">
                  <thead>
                    <tr style="color:#6c757d;">
                      <th style="text-align:left; padding:6px;"></th>
                      <th style="text-align:center; padding:6px;">SPH</th>
                      <th style="text-align:center; padding:6px;">CYL</th>
                      <th style="text-align:center; padding:6px;">Axis</th>
                      <th style="text-align:center; padding:6px;">Add</th>
                      <th style="text-align:center; padding:6px;">PD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th style="text-align:left; padding:6px; color:#6c757d;">OD-Right</th>
                      <td style="text-align:center; padding:6px;">${fmtNum(od.sph)}</td>
                      <td style="text-align:center; padding:6px;">${fmtNum(od.cyl)}</td>
                      <td style="text-align:center; padding:6px;">${fmtAxis(od.axis)}</td>
                      <td style="text-align:center; padding:6px;">${fmtNum(od.add)}</td>
                      ${singlePD ? `<td style="text-align:center; padding:6px;" rowspan="2">${escape(pdRight)}</td>` : `<td style="text-align:center; padding:6px;">${escape(pdRight)}</td>`}
                    </tr>
                    <tr>
                      <th style="text-align:left; padding:6px; color:#6c757d;">OS-Left</th>
                      <td style="text-align:center; padding:6px;">${fmtNum(os.sph)}</td>
                      <td style="text-align:center; padding:6px;">${fmtNum(os.cyl)}</td>
                      <td style="text-align:center; padding:6px;">${fmtAxis(os.axis)}</td>
                      <td style="text-align:center; padding:6px;">${fmtNum(os.add)}</td>
                      ${!singlePD ? `<td style="text-align:center; padding:6px;">${escape(pdLeft)}</td>` : ``}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style="margin-top:8px;">
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px dashed #e5e7eb;">
                  <span style="color:#6c757d;">Rx Type:</span><span>${escape(rxType)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px dashed #e5e7eb;">
                  <span style="color:#6c757d;">Lens Type:</span><span>${escape(lensType)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px dashed #e5e7eb;">
                  <span style="color:#6c757d;">Lenses:</span><span>${escape(lensLabel(rx?.lens))}</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px dashed #e5e7eb;">
                  <span style="color:#6c757d;">Coating:</span><span>${escape(rx?.coating?.title?.toUpperCase?.() || 'None')}</span>
                </div>
                ${tint ? `
                <div style="display:flex; justify-content:space-between; padding:6px 0; border-top:1px dashed #e5e7eb;">
                  <span style="color:#6c757d;">Tint:</span>
                  <span>
                    ${escape(tint?.tintName || 'Sunglasses')}
                    ${tint?.tintColorName ? ' - ' + escape(tint.tintColorName) : ''}
                    ${tint?.tintIntensity ? ' (' + escape(tint.tintIntensity) + ')' : ''}
                    ${typeof tint?.tintPrice === 'number' ? ' + ' + fmtCurrency(Number(tint.tintPrice)) : ''}
                  </span>
                </div>
                ${tint?.tintImage ? `
                <div style="padding:6px 0;">
                  <img src="${escape(tint.tintImage)}" alt="${escape(tint?.tintColorName || 'Tint')}" style="width:36px; height:36px; border-radius:50%; border:1px solid #e5e7eb; object-fit:cover;" />
                </div>` : ``}
                ` : ``}
              </div>
            </div>
          ` : ``}
        </td>
      </tr>`
    }).join('')

    const mailOption = {
      from: "team@glasses-4u.com",
      to: email,
      subject: "Glasses4U Order Confirmation",
      html: `
      <div style="background:#ffffff; padding:24px; font-family:Arial, sans-serif; color:#111;">
        <div style="text-align:center; margin-bottom:10px;">
          <img src="https://glasses-4u.com/static/media/logo.0789a273a4ae1dae1731.png" alt="Glasses4U" style="height:40px; display:inline-block;" />
        </div>
        <div style="text-align:center; margin-bottom:16px;">
          <h1 style="margin:0; font-size:22px;">Thanks for your order, ${escape(name)}</h1>
        </div>
        <div style="margin-bottom:16px; font-size:14px; color:#444;">
          <div><strong>Email:</strong> ${escape(displayEmail)}</div>
          <div><strong>Phone:</strong> ${escape(phone)}</div>
          <div><strong>Address:</strong> ${escape(address)}, ${escape(city)}, ${escape(country)} ${escape(postalCode || '')}</div>
          ${trackingId ? `<div><strong>Tracking:</strong> ${escape(String(trackingId))}</div>` : ``}
          <div><strong>Status:</strong> ${escape(status)}</div>
        </div>
        <h3 style="margin:16px 0 8px;">Items</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        <div style="margin-top:16px; font-size:14px;">
          <div style="display:flex; justify-content:flex-end; margin:2px 0;">Subtotal: ${fmtCurrency(subtotal)}</div>
          <div style="display:flex; justify-content:flex-end; margin:2px 0;">Delivery: ${fmtCurrency(deliveryCharges)}</div>
          <div style="display:flex; justify-content:flex-end; margin:6px 0; font-weight:700;">Total: ${fmtCurrency(total)}</div>
        </div>
        <div style="margin-top:24px; font-size:12px; color:#777;">
          If you have any questions, reply to this email. We’re happy to help.
        </div>
      </div>`
    }

    transport.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log("Email error:", err)
        return res.status(500).json({ success: false, message: "Email failed", error: err })
      } else {
        console.log("Email Sent: " + info.response)
        return res.status(200).json({ success: true, message: "Email sent successfully", info: info.response })
      }
    })
  } catch (e) {
    console.error('Email route error:', e)
    return res.status(500).json({ success: false, message: 'Email failed', error: e?.message || e })
  }
})

module.exports = router