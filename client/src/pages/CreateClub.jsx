import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateClub() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    logo: {
      template: "round",
      primary: "#c40000",
      secondary: "#ffffff",
      accent: "#d4af37",
      textColor: "#ffffff",
      layout: "solid"
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "shortName") {
      setFormData({ ...formData, shortName: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLogoChange = (field, value) => {
    setFormData({
      ...formData,
      logo: {
        ...formData.logo,
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clubs/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert("Fehler beim Erstellen des Clubs");
      return;
    }

    localStorage.setItem("clubId", data.club._id);

    alert("Club erstellt 🔥");
    navigate("/");   // 👈 Weiterleitung zur Startseite
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black/40 p-8 rounded-xl w-[600px] space-y-6"
      >
        <h2 className="text-2xl font-bold">Club erstellen</h2>

        <input
          name="name"
          placeholder="Clubname"
          required
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          name="shortName"
          placeholder="Kürzel (z.B. FCB)"
          required
          maxLength={5}
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded uppercase"
        />

        {/* TEMPLATE */}
        <select
          value={formData.logo.template}
          onChange={(e) => handleLogoChange("template", e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="round">Round Badge</option>
          <option value="elite">Elite Gold Shield</option>
          <option value="modern">Modern Shield</option>
        </select>

        {/* Farben */}
        <div className="flex gap-6 items-center">

          <div>
            <label className="text-sm">Primär</label>
            <input
              type="color"
              value={formData.logo.primary}
              onChange={(e) => handleLogoChange("primary", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Sekundär</label>
            <input
              type="color"
              value={formData.logo.secondary}
              onChange={(e) => handleLogoChange("secondary", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Rahmen</label>
            <input
              type="color"
              value={formData.logo.accent}
              onChange={(e) => handleLogoChange("accent", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Schrift</label>
            <input
              type="color"
              value={formData.logo.textColor}
              onChange={(e) => handleLogoChange("textColor", e.target.value)}
            />
          </div>

        </div>

        {/* Layout */}
        <select
          value={formData.logo.layout}
          onChange={(e) => handleLogoChange("layout", e.target.value)}
          className="w-full p-2 bg-gray-800 rounded"
        >
          <option value="solid">Einfarbig</option>
          <option value="vertical_split">Vertikal geteilt</option>
          <option value="vertical_stripes">Vertikale Streifen</option>
        </select>

        {/* Vorschau */}
        <div className="flex justify-center mt-6">
          <LogoPreview logo={formData.logo} text={formData.shortName} />
        </div>

        <button className="w-full bg-green-600 py-3 rounded hover:bg-green-500 text-lg">
          Club erstellen
        </button>
      </form>
    </div>
  );
}


/* ================= LOGO PREVIEW ================= */

function LogoPreview({ logo, text }) {

  const renderLayout = (clipId) => {
    const content =
      logo.layout === "vertical_split" ? (
        <>
          <rect x="0" y="0" width="50%" height="100%" fill={logo.primary}/>
          <rect x="50%" y="0" width="50%" height="100%" fill={logo.secondary}/>
        </>
      ) : logo.layout === "vertical_stripes" ? (
        <>
          <rect x="0" y="0" width="25%" height="100%" fill={logo.primary}/>
          <rect x="25%" y="0" width="25%" height="100%" fill={logo.secondary}/>
          <rect x="50%" y="0" width="25%" height="100%" fill={logo.primary}/>
          <rect x="75%" y="0" width="25%" height="100%" fill={logo.secondary}/>
        </>
      ) : (
        <rect width="100%" height="100%" fill={logo.primary}/>
      );

    return <g clipPath={`url(#${clipId})`}>{content}</g>;
  };

  return (
    <svg width="240" height="240" viewBox="0 0 200 200">
      <circle cx="100" cy="110" r="90" fill={logo.accent}/>
      <circle cx="100" cy="110" r="75" fill="white"/>

      <defs>
        <clipPath id="roundClip">
          <circle cx="100" cy="110" r="65"/>
        </clipPath>
      </defs>

      <g transform="translate(35,45) scale(1.3)">
        {renderLayout("roundClip")}
      </g>

      <text
        x="100"
        y="120"
        textAnchor="middle"
        fontSize="32"
        fontWeight="bold"
        fill={logo.textColor}
      >
        {text}
      </text>
    </svg>
  );
}