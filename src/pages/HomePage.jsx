
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🍱</span>
          <span>
            <strong style={styles.logoTitle}>
              Campus<span style={styles.blueText}>Bite</span>
            </strong>
            <small style={styles.logoSub}>COLLEGE CANTEEN</small>
          </span>
        </Link>

        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <Link to="/login" style={styles.navLink}>Student Login</Link>
          <Link to="/admin/login" style={styles.navButton}>
            Admin Portal ↗
          </Link>
        </div>
      </nav>

      <main>
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.pill}>
              <span style={styles.dot}></span>
              YOUR CAMPUS, YOUR FOOD
            </div>

            <h1 style={styles.heading}>
              Good food.
              <br />
              <span style={styles.blueText}>Zero waiting.</span>
            </h1>

            <p style={styles.description}>
              Your favourite campus meals, ready when you are.
              Pre-order your food, save your time, and make every
              break a better one.
            </p>

            <div style={styles.actions}>
              <Link to="/register" style={styles.primaryButton}>
                Get Started <span>→</span>
              </Link>
              <Link to="/login" style={styles.secondaryButton}>
                Student Login
              </Link>
            </div>

            <div style={styles.trust}>
              <span style={styles.trustIcon}>✓</span>
              Easy pre-ordering
              <span style={styles.separator}>·</span>
              Convenient pickup
            </div>
          </div>

          <div style={styles.visual}>
            <div style={styles.decorCircle}></div>

            <div style={styles.foodCard}>
              <div style={styles.foodEmoji}>🍱</div>
              <div style={styles.foodTag}>CAMPUS FAVOURITE</div>
              <h3 style={styles.foodTitle}>Your next meal awaits.</h3>
              <p style={styles.foodText}>
                Order ahead. Pick up on time.
              </p>
              <div style={styles.foodBottom}>
                <span>Made for campus life</span>
                <span style={styles.heart}>♥</span>
              </div>
            </div>

            <div style={styles.floatBadge}>
              <span style={styles.checkCircle}>✓</span>
              <span>
                <strong>Smart ordering</strong>
                <small style={styles.badgeText}>
                  Less waiting, more living
                </small>
              </span>
            </div>
          </div>
        </section>

        <section id="features" style={styles.features}>
          <div style={styles.sectionHeading}>
            <span style={styles.eyebrow}>
              SIMPLE. SMART. CONVENIENT.
            </span>
            <h2 style={styles.sectionTitle}>
              Your canteen, made better.
            </h2>
            <p style={styles.sectionText}>
              Everything you need for a smoother campus meal experience.
            </p>
          </div>

          <div style={styles.grid}>
            <article style={styles.featureCard}>
              <div style={styles.featureIconBlue}>🍽️</div>
              <h3>Easy Food Ordering</h3>
              <p style={styles.cardText}>
                Choose your meal and place your order in a few simple steps.
              </p>
            </article>

            <article style={styles.featureCard}>
              <div style={styles.featureIconRed}>🕒</div>
              <h3>Plan Ahead</h3>
              <p style={styles.cardText}>
                Schedule your food order in advance and plan your break.
              </p>
            </article>

            <article style={styles.featureCard}>
              <div style={styles.featureIconBlue}>🎟️</div>
              <h3>Track Your Order</h3>
              <p style={styles.cardText}>
                Keep track of your order and pickup details with ease.
              </p>
            </article>
          </div>
        </section>

        <section style={styles.portals}>
          <div>
            <span style={styles.eyebrow}>GET STARTED</span>
            <h2 style={styles.sectionTitle}>Choose your portal.</h2>
            <p style={styles.sectionText}>
              Welcome! Select the portal that fits your role.
            </p>
          </div>

          <div style={styles.portalGrid}>
            <article style={styles.portalCard}>
              <div style={styles.portalIconBlue}>🎓</div>
              <span style={styles.portalLabelBlue}>FOR STUDENTS</span>
              <h3>Student Portal</h3>
              <p style={styles.cardText}>
                Explore meals, place pre-orders and view your order history.
              </p>
              <Link to="/login" style={styles.portalButton}>
                Student Login <span>→</span>
              </Link>
              <p style={styles.registerText}>
                New here? <Link to="/register" style={styles.inlineLink}>
                  Create an account
                </Link>
              </p>
            </article>

            <article style={styles.portalCard}>
              <div style={styles.portalIconRed}>🛡️</div>
              <span style={styles.portalLabelRed}>FOR STAFF</span>
              <h3>Admin Portal</h3>
              <p style={styles.cardText}>
                Manage canteen orders, food menus, tokens and student access.
              </p>
              <Link to="/admin/login" style={styles.adminButton}>
                Admin Login <span>→</span>
              </Link>
              <p style={styles.registerText}>
                Authorized administrators only
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <Link to="/" style={styles.footerLogo}>
          Campus<span style={styles.blueText}>Bite</span>
        </Link>
        <span>Made for campus life 🍱</span>
        <span>© 2026 Campus Canteen</span>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--page-bg)",
    color: "var(--text)",
    fontFamily: "Inter, sans-serif",
    transition: "background 0.25s ease, color 0.25s ease",
  },

  nav: {
    minHeight: "78px",
    padding: "16px 7%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "var(--text)",
    textDecoration: "none",
  },

  logoIcon: {
    width: "43px",
    height: "43px",
    display: "grid",
    placeItems: "center",
    background: "var(--surface-soft)",
    borderRadius: "13px",
    fontSize: "24px",
  },

  logoTitle: {
    display: "block",
    fontSize: "21px",
    letterSpacing: "-0.7px",
  },

  logoSub: {
    display: "block",
    marginTop: "3px",
    fontSize: "9px",
    letterSpacing: "1.5px",
    color: "var(--muted)",
  },

  blueText: {
    color: "var(--primary)",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },

  navLink: {
    color: "var(--text)",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
  },

  navButton: {
    background: "var(--primary)",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 17px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: 700,
  },

  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "75px 7% 85px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
    alignItems: "center",
    gap: "55px",
  },

  heroContent: {
    maxWidth: "540px",
  },

  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    padding: "9px 13px",
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--primary)",
    borderRadius: "30px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "var(--accent)",
  },

  heading: {
    margin: "24px 0 18px",
    fontSize: "clamp(43px, 6vw, 70px)",
    lineHeight: 1.07,
    letterSpacing: "-3.5px",
    fontWeight: 800,
    color: "var(--text)",
  },

  description: {
    maxWidth: "440px",
    color: "var(--muted)",
    fontSize: "16px",
    lineHeight: 1.9,
  },

  actions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "13px",
    marginTop: "27px",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "22px",
    padding: "15px 21px",
    background: "var(--primary)",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
    boxShadow: "var(--shadow)",
  },

  secondaryButton: {
    padding: "14px 20px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
  },

  trust: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "9px",
    marginTop: "29px",
    fontSize: "12px",
    color: "var(--muted)",
  },

  trustIcon: {
    display: "grid",
    placeItems: "center",
    width: "19px",
    height: "19px",
    borderRadius: "50%",
    background: "var(--success-bg)",
    color: "var(--success-text)",
    fontWeight: 800,
  },

  separator: {
    color: "var(--muted)",
  },

  visual: {
    position: "relative",
    display: "grid",
    placeItems: "center",
    minHeight: "350px",
    padding: "25px 12px",
  },

  decorCircle: {
    position: "absolute",
    width: "min(100%, 390px)",
    aspectRatio: "1",
    borderRadius: "50%",
    background: "var(--surface-soft)",
    border: "1px solid var(--border)",
  },

  foodCard: {
    position: "relative",
    zIndex: 1,
    width: "min(100%, 330px)",
    padding: "25px",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "22px",
    boxShadow: "var(--shadow)",
    transform: "rotate(-2deg)",
  },

  foodEmoji: {
    display: "grid",
    placeItems: "center",
    height: "170px",
    borderRadius: "15px",
    background: "var(--surface-soft)",
    fontSize: "94px",
  },

  foodTag: {
    display: "inline-block",
    marginTop: "20px",
    padding: "6px 9px",
    borderRadius: "6px",
    background: "var(--surface-soft)",
    color: "var(--primary)",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  foodTitle: {
    margin: "12px 0 6px",
    fontSize: "21px",
    color: "var(--text)",
  },

  foodText: {
    margin: "0 0 19px",
    color: "var(--muted)",
    fontSize: "12px",
  },

  foodBottom: {
    paddingTop: "14px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    color: "var(--muted)",
    fontSize: "11px",
  },

  heart: {
    color: "var(--accent)",
    fontSize: "18px",
  },

  floatBadge: {
    position: "absolute",
    zIndex: 2,
    bottom: "18px",
    right: "0",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "15px",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "13px",
    boxShadow: "var(--shadow)",
  },

  checkCircle: {
    display: "grid",
    placeItems: "center",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "var(--success-bg)",
    color: "var(--success-text)",
    fontWeight: 800,
  },

  badgeText: {
    display: "block",
    marginTop: "4px",
    color: "var(--muted)",
  },

  features: {
    padding: "75px 7%",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
    borderBottom: "1px solid var(--border)",
  },

  sectionHeading: {
    textAlign: "center",
    marginBottom: "38px",
  },

  eyebrow: {
    color: "var(--primary)",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.7px",
  },

  sectionTitle: {
    margin: "12px 0",
    fontSize: "clamp(25px, 4vw, 35px)",
    letterSpacing: "-1px",
    color: "var(--text)",
  },

  sectionText: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "14px",
    lineHeight: 1.8,
  },

  grid: {
    maxWidth: "1050px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
    gap: "20px",
  },

  featureCard: {
    padding: "27px",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    background: "var(--surface)",
    color: "var(--text)",
    boxShadow: "var(--shadow)",
  },

  featureIconBlue: {
    display: "grid",
    placeItems: "center",
    width: "49px",
    height: "49px",
    borderRadius: "13px",
    background: "var(--surface-soft)",
    color: "var(--primary)",
    fontSize: "24px",
  },

  featureIconRed: {
    display: "grid",
    placeItems: "center",
    width: "49px",
    height: "49px",
    borderRadius: "13px",
    background: "var(--danger-bg)",
    color: "var(--danger-text)",
    fontSize: "24px",
  },

  cardText: {
    color: "var(--muted)",
    fontSize: "14px",
    lineHeight: 1.8,
  },

  portals: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "75px 7%",
  },

  portalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
    gap: "22px",
    marginTop: "32px",
  },

  portalCard: {
    padding: "30px",
    background: "var(--surface)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    boxShadow: "var(--shadow)",
  },

  portalIconBlue: {
    display: "grid",
    placeItems: "center",
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "var(--surface-soft)",
    fontSize: "25px",
  },

  portalIconRed: {
    display: "grid",
    placeItems: "center",
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "var(--danger-bg)",
    fontSize: "25px",
  },

  portalLabelBlue: {
    display: "block",
    marginTop: "23px",
    color: "var(--primary)",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.4px",
  },

  portalLabelRed: {
    display: "block",
    marginTop: "23px",
    color: "var(--accent)",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.4px",
  },

  portalButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "22px",
    padding: "14px 16px",
    borderRadius: "10px",
    background: "var(--primary)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
  },

  adminButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "22px",
    padding: "14px 16px",
    borderRadius: "10px",
    background: "var(--accent)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
  },

  registerText: {
    marginTop: "18px",
    color: "var(--muted)",
    fontSize: "12px",
  },

  inlineLink: {
    color: "var(--primary)",
    fontWeight: 600,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    padding: "25px 7%",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
    color: "var(--muted)",
    fontSize: "12px",
  },

  footerLogo: {
    fontSize: "17px",
    fontWeight: 800,
    color: "var(--text)",
    textDecoration: "none",
  },
};
