import React from "react"

const PrivacyPolicy = () => {
  const lastUpdated = "January 29, 2025"

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collection", title: "Information Collection" },
    { id: "use-of-information", title: "Use of Information" },
    { id: "information-sharing", title: "Information Sharing" },
    { id: "data-security", title: "Data Security" },
    { id: "your-rights", title: "Your Rights" },
    { id: "children-privacy", title: "Children's Privacy" },
    { id: "international-transfers", title: "International Transfers" },
    { id: "policy-updates", title: "Policy Updates" },
    { id: "contact", title: "Contact Information" },
  ]

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#333",
  }

  const headerStyle = {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    marginBottom: "20px",
    borderBottom: "1px solid #e9ecef",
  }

  const h1Style = {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
  }

  const h2Style = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    marginTop: "30px",
  }

  const linkStyle = {
    color: "#007bff",
    textDecoration: "none",
  }

  const listStyle = {
    paddingLeft: "20px",
    marginBottom: "15px",
  }

  const footerStyle = {
    marginTop: "40px",
    padding: "20px 0",
    borderTop: "1px solid #e9ecef",
    textAlign: "center",
    fontSize: "14px",
    color: "#6c757d",
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={h1Style}>Privacy Policy</h1>
      </header>
      <main>
        <p style={{ fontSize: "14px", color: "#6c757d", marginBottom: "20px" }}>Last Updated: {lastUpdated}</p>

        <nav style={{ marginBottom: "30px" }}>
          <h2 style={{ ...h2Style, fontSize: "20px" }}>Table of Contents</h2>
          <ul style={listStyle}>
            {sections.map((section) => (
              <li key={section.id} style={{ marginBottom: "5px" }}>
                <a href={`#${section.id}`} style={linkStyle}>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section id="introduction">
          <h2 style={h2Style}>1. Introduction</h2>
          <p>
            ProCode ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy outlines our
            practices concerning the collection, use, and disclosure of your information when you use our application
            and services. By accessing or using our services, you agree to the terms of this Privacy Policy.
          </p>
        </section>

        <section id="information-collection">
          <h2 style={h2Style}>2. Information Collection</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul style={listStyle}>
            <li>
              <strong>Account Information:</strong> Name, email address, and profile picture when you register using
              Google Authentication.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our application, including access times, device
              information, IP address, and in-app interactions.
            </li>
            <li>
              <strong>Communication Data:</strong> Information you provide when contacting our support team.
            </li>
          </ul>
        </section>

        <section id="use-of-information">
          <h2 style={h2Style}>3. Use of Information</h2>
          <p>We use the collected information to:</p>
          <ul style={listStyle}>
            <li>Provide, maintain, and improve our services</li>
            <li>Authenticate users and manage platform access</li>
            <li>Personalize user experience and deliver relevant content</li>
            <li>Analyze usage patterns and optimize application performance</li>
            <li>Communicate updates, features, and support information</li>
            <li>Detect, investigate, and prevent fraudulent transactions and illegal activities</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section id="information-sharing">
          <h2 style={h2Style}>4. Information Sharing</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul style={listStyle}>
            <li>
              <strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating
              our services.
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
            </li>
            <li>
              <strong>Legal Compliance:</strong> When required by law or to protect our rights and safety.
            </li>
            <li>
              <strong>Consent:</strong> With your explicit consent for any other purpose.
            </li>
          </ul>
        </section>

        <section id="data-security">
          <h2 style={h2Style}>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure. We strive to use commercially
            acceptable means to protect your personal information but cannot guarantee its absolute security.
          </p>
        </section>

        <section id="your-rights">
          <h2 style={h2Style}>6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul style={listStyle}>
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Object to the processing of your data</li>
            <li>Request data portability</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Information"
            section.
          </p>
        </section>

        <section id="children-privacy">
          <h2 style={h2Style}>7. Children's Privacy</h2>
          <p>
            Our services are not intended for use by children under the age of 13. We do not knowingly collect personal
            information from children under 13. If you believe we may have collected information from a child under 13,
            please contact us immediately.
          </p>
        </section>

        <section id="international-transfers">
          <h2 style={h2Style}>8. International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. By using our
            services, you consent to the transfer of information to countries that may have different data protection
            rules than your country.
          </p>
        </section>

        <section id="policy-updates">
          <h2 style={h2Style}>9. Policy Updates</h2>
          <p>
            We may update this Privacy Policy periodically. The updated version will be indicated by a revised "Last
            Updated" date. We encourage you to review this Privacy Policy regularly to stay informed about our
            information practices.
          </p>
        </section>

        <section id="contact">
          <h2 style={h2Style}>10. Contact Information</h2>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <p>
            <a href="mailto:procode.onlineinc@gmail.com" style={linkStyle}>
              procode.onlineinc@gmail.com
            </a>
          </p>
        </section>
      </main>
      <footer style={footerStyle}>
        <p>&copy; {new Date().getFullYear()} ProCode</p>
        <div style={{ marginTop: "10px" }}>
          <a href="/terms" style={{ ...linkStyle, marginRight: "15px" }}>
            Terms of Service
          </a>
          <a href="/contact" style={linkStyle}>
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy

