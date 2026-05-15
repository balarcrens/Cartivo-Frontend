import React from 'react';
import LegalLayout from '../../Components/Legal/LegalLayout';

export default function TermsOfUse() {
    return (
        <LegalLayout title="Terms of Use" lastUpdated="May 14, 2026">
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                <p>
                    These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Cartivo ("we," "us" or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
                <p className="mb-4">
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
                </p>
                <p>
                    The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Representations</h2>
                <p className="mb-4">
                    By using the Site, you represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                    <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                    <li>You are not a minor in the jurisdiction in which you reside.</li>
                    <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
                <p className="mb-4">
                    You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                    <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                    <li>Circumvent, disable, or otherwise interfere with security-related features of the Site.</li>
                    <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Modifications and Interruptions</h2>
                <p>
                    We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Governing Law</h2>
                <p>
                    These Terms of Use and your use of the Site are governed by and construed in accordance with the laws of the State of Delaware applicable to agreements made and to be entirely performed within the State of Delaware, without regard to its conflict of law principles.
                </p>
            </section>
        </LegalLayout>
    );
}
