import React from "react";

export default function ComponentPreview({ properties, selected, onSelect, type }) {
  const renderElement = () => {
    switch (type) {
      case "button":
        return (
          <button
            style={{
              background: properties.color,
              fontSize: properties.fontSize,
              color: "#bbb",
              padding: `${properties.padding || 12}px 24px`,
              margin: `${properties.margin || 0}px`,
              border: "none",
              borderRadius: properties.borderRadius || 6,
              boxShadow: properties.boxShadow ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              fontWeight: properties.fontWeight || "normal",
              display: "inline-block",
              width: "auto",
            }}
            className={`transition focus:outline-none ${selected ? "ring-4 ring-blue-400" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect();
            }}
          >
            {properties.text}
          </button>
        );
      
      case "input":
        return (
          <input
            placeholder={properties.placeholder}
            style={{
              background: "#fff",
              fontSize: properties.fontSize,
              color: properties.color,
              padding: `${properties.padding || 12}px 24px`,
              margin: `${properties.margin || 0}px`,
              border: "1px solid #ccc",
              borderRadius: properties.borderRadius || 6,
              boxShadow: properties.boxShadow ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              fontWeight: properties.fontWeight || "normal",
              width: "100%",
              maxWidth: "300px",
              display: "block",
            }}
            className={`transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${selected ? "ring-4 ring-blue-400" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect();
            }}
          />
        );
      
      case "heading":
        return (
          <h2
            style={{
              color: properties.color,
              fontSize: properties.fontSize,
              fontWeight: properties.fontWeight,
              margin: `${properties.margin || 0}px`,
              padding: `${properties.padding || 0}px`,
              display: "block",
              width: "100%",
            }}
            className={`transition cursor-pointer ${selected ? "ring-4 ring-blue-400" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect();
            }}
          >
            {properties.text}
          </h2>
        );
      
      case "card":
        return (
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: properties.borderRadius || 12,
              padding: `${properties.padding || 24}px`,
              margin: `${properties.margin || 0}px`,
              background: "#fff",
              boxShadow: properties.boxShadow ? "0 2px 8px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
              maxWidth: "300px",
              width: "100%",
              display: "block",
            }}
            className={`transition cursor-pointer ${selected ? "ring-4 ring-blue-400" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect();
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#171717" }}>
              {properties.title}
            </h3>
            <p style={{ fontSize: 16, color: "#444", margin: 0 }}>
              {properties.content}
            </p>
            {properties.image && (  <img
                src={properties.image}
                alt="Card image"
                style={{ width: "100%", marginTop: 12, borderRadius: 8 }} />
            )}
          </div>
        );
      
      case "image":
        return (
          <img
            src={properties.src}
            alt={properties.alt}
            style={{
              maxWidth: "100%",
              borderRadius: properties.borderRadius || 8,
              maxHeight: "200px",
              objectFit: "cover",
              margin: `${properties.margin || 0}px`,
              padding: `${properties.padding || 0}px`,
              display: "block",
              width: "auto",
            }}
            className={`transition cursor-pointer ${selected ? "ring-4 ring-blue-400" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect();
            }}
          />
        );
      
      default:
        return <div>Unknown element type</div>;
    }
  };

  return renderElement();
}

