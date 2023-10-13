import { PAYMENT_TYPE } from '/imports/constants/common';
import { renderInvoicePdf, sendInvoiceEmail } from '/imports/api/gopay/emails/invoiceEmails';
import { createVoucherFile } from '/imports/api/gopay/emails/giftEmails';
import { getInvoiceFilename, getVoucherFilename } from '/imports/utils/InvoiceUtils';

/**
 * Send a confirmation email to a customer, including attachments.
 *
 * This function sends a confirmation email, which includes an invoice as an attachment.
 * If the payment type is a gift, it also attaches a voucher to the email.
 *
 * @param {Object} payment - The payment object containing payment details.
 * @returns {Promise} A promise that resolves once the email is sent.
 */
export async function sendConfirmationEmail(payment) {
    const attachments = [{
        filename: getInvoiceFilename(payment.gopay.id),
        content: await renderInvoicePdf(payment),
    }];
    if (payment.paymentType === PAYMENT_TYPE.GIFT) {
        attachments.push({
            filename: getVoucherFilename(payment.gopay.id, payment.giftCount),
            content: await createVoucherFile({ gopayId: payment.gopay.id }),
        });
    }
    sendInvoiceEmail(payment, attachments);
}

// file shortened as an example
