import React from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';

export default function WarrantyPolicy() {
    return (
        <LegalLayout title="Warranty Policy" lastUpdated="May 14, 2026">
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Warranty Coverage</h2>
                <p className="mb-4">
                    Cartivo warrants all products against defects in materials and workmanship under normal use for a period of ONE (1) YEAR from the date of retail purchase by the original end-user purchaser ("Warranty Period").
                </p>
                <p>
                    If a hardware defect arises and a valid claim is received within the Warranty Period, at its option and to the extent permitted by law, Cartivo will either (1) repair the hardware defect at no charge, using new or refurbished replacement parts, (2) exchange the product with a product that is new or refurbished, or (3) refund the purchase price of the product.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Exclusions and Limitations</h2>
                <p className="mb-4">
                    This Limited Warranty applies only to products manufactured by or for Cartivo that can be identified by the "Cartivo" trademark, trade name, or logo affixed to them. The Limited Warranty does not apply to any non-Cartivo hardware products or any software, even if packaged or sold with Cartivo hardware.
                </p>
                <p className="mb-4">This warranty does not apply to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Damage caused by accident, abuse, misuse, flood, fire, earthquake, or other external causes.</li>
                    <li>Damage caused by operating the product outside the permitted or intended uses described by Cartivo.</li>
                    <li>Damage caused by service performed by anyone who is not a representative of Cartivo.</li>
                    <li>A product or part that has been modified to alter functionality or capability without the written permission of Cartivo.</li>
                    <li>Consumable parts, such as batteries, unless damage has occurred due to a defect in materials or workmanship.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Obtaining Warranty Service</h2>
                <p className="mb-4">
                    To obtain warranty service, you must deliver the product, either in its original packaging or packaging providing an equal degree of protection, to the address specified by Cartivo. In accordance with applicable law, Cartivo may require that you furnish proof of purchase details and/or comply with registration requirements before receiving warranty service.
                </p>
                <p>
                    Please contact our customer support team at support@cartivo.com for specific instructions on how to obtain warranty service for your product.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Return Process</h2>
                <p className="mb-4">
                    Once your warranty claim is approved, you will receive a Return Merchandise Authorization (RMA) number. Returns will not be accepted without an RMA number.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Pack the item securely in its original packaging.</li>
                    <li>Include the original receipt or proof of purchase.</li>
                    <li>Clearly mark the RMA number on the outside of the package.</li>
                    <li>Ship the package to the address provided by our support team.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disclaimer of Warranties</h2>
                <p>
                    EXCEPT AS PROVIDED IN THIS WARRANTY AND TO THE EXTENT PERMITTED BY LAW, CARTIVO IS NOT RESPONSIBLE FOR DIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES RESULTING FROM ANY BREACH OF WARRANTY OR CONDITION, OR UNDER ANY OTHER LEGAL THEORY, INCLUDING BUT NOT LIMITED TO LOSS OF USE; LOSS OF REVENUE; LOSS OF ACTUAL OR ANTICIPATED PROFITS.
                </p>
            </section>
        </LegalLayout>
    );
}
