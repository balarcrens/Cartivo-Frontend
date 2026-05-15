import React from 'react';

const InvoiceTemplate = ({ order, items }) => {
    const address = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;

    // Formatting constants
    const colors = {
        primary: '#1A1A1A',
        secondary: '#4B5563',
        lightGray: '#F3F4F6',
        border: '#E5E7EB',
        white: '#FFFFFF',
    };

    const logoUrl = window.location.origin + '/logo_v2.png';
    const invoiceNo = order.id.split('-')[0].toUpperCase();
    const formattedDate = new Date(order.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const formatCurrency = (amount) => `₹${parseFloat(amount).toLocaleString('en-IN')}`;

    return (
        <div
            id="invoice-content"
            style={{
                width: '794px', // Standard A4 width at 96 DPI
                height: '1122px', // Standard A4 height at 96 DPI
                backgroundColor: colors.white,
                margin: '0 auto',
                padding: '60px 50px 0 50px',
                fontFamily: '"Outfit", "Inter", sans-serif',
                color: colors.primary,
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: '0',
                width: '100%',
                height: '220px',
                pointerEvents: 'none'
            }}>
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%', display: 'block' }}>
                    <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#1A1A1A' }}></path>
                    <path d="M0.00,49.98 C149.99,150.00 271.49,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#333333', opacity: '0.4' }}></path>
                </svg>
            </div>

            <div style={{ position: 'relative', zIndex: '1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <img
                            src={logoUrl}
                            alt="Cartivo"
                            style={{ height: '45px', width: 'auto', marginBottom: '4px' }}
                            crossOrigin="anonymous"
                        />
                    </div>
                    <div>
                        <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: '500', color: colors.secondary }}>
                            NO. {invoiceNo}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            Date: <span style={{ fontWeight: '400' }}>{formattedDate}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', marginBottom: '50px' }}>
                    <div style={{ flex: '1', marginRight: '40px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Billed to:
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>{address.full_name}</div>
                        <div style={{ fontSize: '13px', color: colors.secondary, lineHeight: '1.6' }}>
                            {address.address_line1}<br />
                            {address.address_line2 && <>{address.address_line2}<br /></>}
                            {address.city}, {address.state} - {address.pincode}<br />
                            {address.phone}
                        </div>
                    </div>
                    <div style={{ flex: '1' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            From:
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>Cartivo Store</div>
                        <div style={{ fontSize: '13px', color: colors.secondary, lineHeight: '1.6' }}>
                            123 Luxury Ave, Design District<br />
                            Mumbai, Maharashtra - 400001<br />
                            hello@cartivo.com
                        </div>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.lightGray }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', verticalAlign: 'middle' }}>Item</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', verticalAlign: 'middle' }}>Quantity</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', verticalAlign: 'middle' }}>Price</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', verticalAlign: 'middle' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.product_name}</div>
                                    {item.variant_name && (
                                        <div style={{ fontSize: '11px', color: colors.secondary, marginTop: '2px' }}>{item.variant_name}</div>
                                    )}
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center', fontSize: '14px' }}>{item.quantity}</td>
                                <td style={{ padding: '15px', textAlign: 'right', fontSize: '14px' }}>{formatCurrency(item.price)}</td>
                                <td style={{ padding: '15px', textAlign: 'right', fontSize: '14px', fontWeight: '600' }}>
                                    {formatCurrency(parseFloat(item.price) * item.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '60px' }}>
                    <div style={{ width: '280px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', borderBottom: `1px solid ${colors.border}` }}>
                            <span style={{ color: colors.secondary }}>Subtotal</span>
                            <span style={{ fontWeight: '500' }}>{formatCurrency(order.total_price)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', borderBottom: `1px solid ${colors.border}` }}>
                            <span style={{ color: colors.secondary }}>Shipping</span>
                            <span style={{ fontWeight: '500', color: '#10B981' }}>FREE</span>
                        </div>
                        {parseFloat(order.discount_amount) > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', borderBottom: `1px solid ${colors.border}` }}>
                                <span style={{ color: colors.secondary }}>Discount</span>
                                <span style={{ fontWeight: '500', color: '#EF4444' }}>-{formatCurrency(order.discount_amount)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', marginTop: '4px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '700', textTransform: 'uppercase' }}>Grand Total</span>
                            <span style={{ fontSize: '18px', fontWeight: '700' }}>{formatCurrency(order.final_price)}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', color: colors.secondary }}>Payment method: </span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{order.payment_method}</span>
                    </div>
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', color: colors.secondary }}>Note: </span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>Thank you for choosing Cartivo! Experience the pinnacle of luxury.</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default InvoiceTemplate;


