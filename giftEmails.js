/* globals SSR */
import { i18n } from '/imports/utils/i18n';
import AdmZip from 'adm-zip';
import { APP_NAME } from '/imports/constants/appNames';
import invoicePdfI18n from '/imports/i18n/nedatlujPlus/invoicePdf';
import giftsVoucherI18n from '/imports/i18n/gifts/giftsVoucher.js';
import routesI18n from '/imports/constants/routes/routes';
import commonI18n from '/imports/i18n/common';
import commonBundleI18n from '/imports/i18n/commonBundle';
import transactionalEmailsI18n from '/imports/i18n/transactionalEmails';
import { createPdfBuffer } from '/imports/api/gopay/emails/emailUtils';
import { Gifts } from '/imports/api/gifts/gifts';

/**
 * compiler and render gift voucher HTML
 * exported for dev server route
 */
export function createGiftVoucherHtml(gift) {
    const gopayVoucherTemplate = 'giftsVoucher';
    SSR.compileTemplate(gopayVoucherTemplate, Assets.getText(`${gopayVoucherTemplate}.html`));
    Template[gopayVoucherTemplate].onCreated(function () {
        this.invoicePdfI18n = invoicePdfI18n;
        this.giftsVoucherI18n = giftsVoucherI18n;
        this.routesI18n = routesI18n;
        this.commonI18n = commonI18n;
        this.commonBundleI18n = commonBundleI18n;
    });
    return SSR.render(gopayVoucherTemplate, {
        giftCode: gift.giftCode,
        gopayId: gift.gopayId,
        appName: APP_NAME.toLowerCase(),
    });
}

/**
 * render PDF of gift voucher from HTML template
 */
function createGiftVoucherPdf(gift) {
    const giftVoucherHtml = createGiftVoucherHtml(gift);
    return createPdfBuffer(giftVoucherHtml);
}

/**
 * create voucher file from rendered html template
 * create pdf file or zip archive in case of multiple vouchers
 *
 * @param selector {Object} find by property `paymentId` or `giftCode`
 */
export async function createVoucherFile(selector) {
    const gifts = Gifts.find(selector).fetch();
    let fileBuffer;
    if (gifts.length > 1) {
        const zip = new AdmZip();
        const promises = [];
        for (const gift of gifts) {
            promises.push(createGiftVoucherPdf(gift));
        }
        const giftVouchers = await Promise.all(promises);
        for (const gift of gifts) {
            const t9n = i18n('transactionalEmails.paymentConfirmation.gift.filename', transactionalEmailsI18n);
            const filename = `${t9n}-${APP_NAME}-${gift.giftCode}.pdf`;
            zip.addFile(filename, giftVouchers.shift());
        }
        fileBuffer = zip.toBuffer();
    } else {
        fileBuffer = await createGiftVoucherPdf(gifts[0]);
    }
    return fileBuffer;
}
