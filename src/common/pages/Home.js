import React, { useState } from "react";
import Container from "@mui/material/Container";
import { SectionTitleOne } from "../components/SectionTitle";
import { Row } from "react-bootstrap";
import CategoryGrid from "../components/categoryGrid/CategoryGrid";
import HeroSlider from "../components/heroSlider/HeroSlider";
import { heroSliderData } from "../components/heroSlider/heroSlider-data";

const MaintenanceBanner = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div style={{
            position: "fixed",
            bottom: "120px",
            right: "32px",
            zIndex: 9999,
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderLeft: "6px solid #f59e0b",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            padding: "48px 40px",
            maxWidth: "620px",
            width: "620px",
            minHeight: "180px",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
        }}>
            <span style={{ fontSize: "28px", flexShrink: 0, marginTop: "2px" }}>⚠️</span>

            <div style={{ flex: 1 }}>
                <p style={{
                    margin: "0 0 12px 0",
                    fontSize: "16px",
                    color: "#374151",
                    lineHeight: "1.7",
                }}>
                    Votre <span>E-shop Biotech Dental</span> sera en maintenance et inaccessible de{" "}
                    <strong>vendredi 16h30</strong> à <strong>lundi 9h00</strong>.
                </p>
                <p style={{
                    margin: "0",
                    fontSize: "15px",
                    color: "#6b7280",
                    lineHeight: "1.7",
                }}>
                    Nous nous excusons pour la gêne occasionnée.
                    <br/>
                    <br />
                    À très bientôt.
                    <br />
                    <p>L'équipe Biotech Dental</p>
                </p>
            </div>

            <button
                onClick={() => setVisible(false)}
                aria-label="Fermer"
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    fontSize: "22px",
                    lineHeight: 1,
                    padding: "0",
                    flexShrink: 0,
                    marginTop: "1px",
                }}
            >
                ✕
            </button>
        </div>
    );
};

const Home = () => {
    return (
        <>
            {/* Hero Slider */}
            <HeroSlider sliderData={heroSliderData} />
            <div className="space-mb--r100"></div>

            {/* Category grid */}
            <div className="section-title-container">
                <Container>
                    <Row>
                        <div className="col-lg-12">
                            <SectionTitleOne title="Nos produits et solutions" />
                        </div>
                    </Row>
                </Container>
            </div>
            <div className="space-mb--r50"></div>
            <CategoryGrid spaceBottomClass="space-mb--r100" />
        </>
    );
};

export default Home;