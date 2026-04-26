const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const Newsletter = require('../models/newsletter')
const Product = require('../models/product')
const Category = require('../models/category')
const fetchAdmin = require('../middleware/fetchadmin')

const escape = (s) => String(s || '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]))
const fmtCurrency = (n) => Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const createTransport = () => nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
        user: 'team@glasses-4u.com',
        pass: 'karachi2020'
    }
})

const toSlug = (s) => (s || '').toString().toLowerCase().replace(/[\s\-_\/]+/g, '-').replace(/[^a-z0-9-]/g, '')

const buildEmailHtml = (newsletter, products, categories = []) => {
    const rows = []
    for (let i = 0; i < products.length; i += 2) {
        const pair = products.slice(i, i + 2)
        rows.push(`
            <tr>
              ${pair.map((p) => {
                  const price = Number(p.salePrice || 0) > 0 ? p.salePrice : p.price
                  const imgSrc = p.assets?.[0]?.url || ''
                  return `
                    <td width="50%" style="padding:8px; vertical-align:top;">
                      <div style="border:1px solid #eee; border-radius:8px; overflow:hidden; text-align:center; background:#fff;">
                        <div style="background:#f5f5f5; font-size:12px; font-weight:bold; padding:8px;">Just For ${fmtCurrency(price)}</div>
                        ${imgSrc ? `<img src="${escape(imgSrc)}" alt="${escape(p.name)}" style="width:100%; max-width:200px; height:150px; object-fit:contain;" />` : ''}
                        <div style="padding:10px;">
                          <div style="font-weight:600; font-size:13px; margin-bottom:4px;">${escape(p.name)}</div>
                          <a href="https://glasses-4u.com/product/${p._id}" style="display:inline-block; background:#000; color:#fff; padding:8px 22px; border-radius:4px; text-decoration:none; font-size:12px; margin-top:8px; letter-spacing:0.5px;">SHOP NOW</a>
                        </div>
                      </div>
                    </td>`
              }).join('')}
              ${pair.length === 1 ? '<td width="50%"></td>' : ''}
            </tr>`)
    }

    const productGrid = products.length > 0 ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
          ${rows.join('')}
        </table>` : ''

    return `
    <div style="background:#fce8ec; padding:28px 0; font-family:Arial,sans-serif;">
      <div style="background:#ffffff; max-width:600px; margin:0 auto; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(236,140,151,0.18);">

        <!-- Logo / Header -->
        <div style="background:linear-gradient(135deg,#f8a8b3 0%,#f39ca8 50%,#ec8c97 100%); text-align:center; padding:28px 20px 16px;">
          <img src="https://glasses-4u.com/static/media/logo.0789a273a4ae1dae1731.png" alt="Glasses4U" style="height:56px;" />
          <p style="margin:8px 0 0; font-size:13px; color:#fff; letter-spacing:2px; text-transform:uppercase; font-weight:600;">Eyewear for Everyone</p>
        </div>

        <!-- Nav Links -->
        <div style="background:#fff; border-bottom:2px solid #f39ca8; padding:10px 16px; text-align:center;">
          ${[
            ...categories.map(c => `<a href="https://glasses-4u.com/category/${toSlug(c.mainHeading)}" style="display:inline-block; margin:4px 8px; font-size:13px; font-weight:600; color:#111; text-decoration:none;">${escape(c.mainHeading)}</a>`),
            `<a href="https://glasses-4u.com/contact" style="display:inline-block; margin:4px 8px; font-size:13px; font-weight:600; color:#111; text-decoration:none;">Contact Us</a>`,
            `<a href="https://glasses-4u.com/about" style="display:inline-block; margin:4px 8px; font-size:13px; font-weight:600; color:#111; text-decoration:none;">About Us</a>`,
            `<a href="https://glasses-4u.com/help" style="display:inline-block; margin:4px 8px; font-size:13px; font-weight:600; color:#111; text-decoration:none;">Help Center</a>`,
          ].join('')}
        </div>

        <!-- Cover Image 1 -->
        ${newsletter.coverImageOne ? `<img src="${escape(newsletter.coverImageOne)}" alt="Newsletter" style="width:100%; display:block;" />` : ''}

        <!-- Text Content -->
        ${newsletter.tectContent ? `
        <div style="padding:36px 32px; text-align:center;">
          <p style="margin:0; font-size:36px; line-height:1.3; color:#111; font-weight:900; letter-spacing:-0.5px; text-transform:uppercase; font-family:Arial,sans-serif;">${newsletter.tectContent}</p>
        </div>` : ''}

        <!-- Divider -->
        ${newsletter.tectContent && products.length > 0 ? `<div style="height:2px; background:linear-gradient(135deg,#f8a8b3,#ec8c97); margin:0 32px;"></div>` : ''}

        <!-- Product Cards -->
        ${productGrid ? `<div style="padding:8px 16px 0;">${productGrid}</div>` : ''}

        <!-- Cover Image 2 -->
        ${newsletter.coverImageTwo ? `<img src="${escape(newsletter.coverImageTwo)}" alt="Banner" style="width:100%; display:block; margin-top:8px;" />` : ''}

        <!-- Footer -->
        <div style="padding:28px 24px; text-align:center; background:linear-gradient(135deg,#f8a8b3 0%,#f39ca8 50%,#ec8c97 100%); margin-top:8px;">
          <p style="margin:0 0 8px; font-size:14px; color:#fff; font-weight:600;">We hope this email finds you well.</p>
          <p style="margin:0 0 8px; font-size:12px; color:#fff;">You have received this email because you subscribed at <a href="https://glasses-4u.com" style="color:#fff; font-weight:700;">glasses-4u.com</a></p>
          <p style="margin:0; font-size:10px; color:rgba(255,255,255,0.8);">Disclaimer: Cannot be used in conjunction with any other offers. Promotions are subject to change without notice. We reserve the right to cancel any orders deemed fraudulent.</p>
        </div>

      </div>
    </div>`
}


// GET all newsletters
router.get('/', fetchAdmin, async (req, res) => {
    try {
        const newsletters = await Newsletter.find().sort({ date: -1 }).populate('products')
        res.json(newsletters)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Internal Server Error')
    }
})


// GET single newsletter
router.get('/:id', fetchAdmin, async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id).populate('products')
        if (!newsletter) return res.status(404).send('Not found')
        res.json(newsletter)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Internal Server Error')
    }
})


// POST /broadcast — send emails then save newsletter
router.post('/broadcast', fetchAdmin, async (req, res) => {
    try {
        const { coverImageOne, coverImageTwo, tectContent, emails = [], products: productIds = [] } = req.body

        if (!emails.length) return res.status(400).json({ error: 'At least one email is required' })

        // Fetch product and category data for the email template
        const [products, categories] = await Promise.all([
            productIds.length ? Product.find({ _id: { $in: productIds } }) : [],
            Category.find({}, 'mainHeading').lean(),
        ])

        const newsletterData = { coverImageOne, coverImageTwo, tectContent, emails, products: productIds }
        const html = buildEmailHtml(newsletterData, products, categories)

        const transport = createTransport()

        // Fire-and-forget — do not await, we don't care about delivery status
        emails.forEach((email) => {
            transport.sendMail({
                from: 'team@glasses-4u.com',
                to: email,
                subject: 'Glasses4U Newsletter',
                html,
            }, (err) => {
                if (err) console.error(`Newsletter email failed to ${email}:`, err.message)
            })
        })

        // Save newsletter document immediately without waiting for emails
        const newsletter = await Newsletter.create(newsletterData)

        res.json({
            success: true,
            message: `Newsletter broadcast initiated to ${emails.length} recipient(s)`,
            newsletter,
        })
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Internal Server Error')
    }
})


// DELETE /:id
router.delete('/:id', fetchAdmin, async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Internal Server Error')
    }
})


module.exports = router
