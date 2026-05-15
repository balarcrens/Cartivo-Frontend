import React from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';

export default function PrivacyPolicy() {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="May 14, 2026">
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="mb-4">
                    At Cartivo, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p>
                    Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Collection of Your Information</h2>
                <p className="mb-4">
                    We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests.</li>
                    <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
                    <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Your Information</h2>
                <p className="mb-4">
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Create and manage your account.</li>
                    <li>Process payments and refunds.</li>
                    <li>Deliver products and services you have requested.</li>
                    <li>Send you newsletters, marketing communications, and other information regarding our products and services.</li>
                    <li>Improve our website and services based on your usage and feedback.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclosure of Your Information</h2>
                <p className="mb-4">
                    We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                    <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Security of Your Information</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 italic">
                    Email: support@cartivo.com<br />
                    Phone: +1 (555) 123-4567<br />
                    Address: 123 Luxury Lane, E-commerce City, EC 12345
                </div>
            </section>
        </LegalLayout>
    );
}
