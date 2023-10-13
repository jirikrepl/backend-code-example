# Node.js Backend Code Example

This is an example of production backend code. 
The backend is built using the Meteor.js framework, which is built on top of Node.js. 
This code is responsible for generating Gift Voucher PDFs.
It is utilized on [this page](https://www.nedatluj.cz/darkove-poukazy) after a user purchases a gift voucher.

## Workflow
This workflow outlines the key steps involved in generating Gift Voucher PDFs for users who purchase them.

1. **payments.js file**:
    - When a payment is made, the `sendConfirmationEmail()` function is called.

2. **Processing Gift Payments**:
    - In the case of a payment type being `GIFT`, the `createVoucherFile()` function is invoked.

3. **createVoucherFile() Function**:
    - The `createVoucherFile()` function performs several tasks:
        1. It determines whether to create a zip file with multiple PDFs or just a single PDF.
        2. The function imports the `giftVoucher.html` template.
        3. It loads the appropriate i18n file.
        4. It generates the PDF file.

4. **Email Attachment**:
    - The generated PDF file is made available as an email attachment, ready to be sent in the payment confirmation email.
