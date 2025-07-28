import React from "react";

export default function PropertyPanel({ properties, onChange, type }) {
  const inputClasses = "mt-1 block w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
  const sectionClasses = "space-y-4";

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-6 text-gray-100 max-h-[600px] overflow-y-auto">
      <h3 className="font-bold text-xl text-gray-200 border-b border-gray-700 pb-3">
        {type.charAt(0).toUpperCase() + type.slice(1)} Properties
      </h3>
      
      {/* Content Properties */}
      <div className={sectionClasses}>
        {type === "button" && (
          <div>
            <label className={labelClasses}>Button Text</label>
            <input
              type="text"
              value={properties.text || ""}
              onChange={(e) => onChange({ ...properties, text: e.target.value })}
              className={inputClasses}
              placeholder="Enter button text..."
            />
          </div>
        )}
        
        {type === "heading" && (
          <div>
            <label className={labelClasses}>Heading Text</label>
            <input
              type="text"
              value={properties.text || ""}
              onChange={(e) => onChange({ ...properties, text: e.target.value })}
              className={inputClasses}
              placeholder="Enter heading text..."
            />
          </div>
        )}
        
        {type === "input" && (
          <div>
            <label className={labelClasses}>Placeholder Text</label>
            <input
              type="text"
              value={properties.placeholder || ""}
              onChange={(e) => onChange({ ...properties, placeholder: e.target.value })}
              className={inputClasses}
              placeholder="Enter placeholder text..."
            />
          </div>
        )}
        
        {type === "card" && (
          <>
            <div>
              <label className={labelClasses}>Card Title</label>
              <input
                type="text"
                value={properties.title || ""}
                onChange={(e) => onChange({ ...properties, title: e.target.value })}
                className={inputClasses}
                placeholder="Enter card title..."
              />
            </div>
            <div>
              <label className={labelClasses}>Card Content</label>
              <textarea
                value={properties.content || ""}
                onChange={(e) => onChange({ ...properties, content: e.target.value })}
                className={inputClasses}
                rows={3}
                placeholder="Enter card content..."
              />
            </div>
            <div>
              <label className={labelClasses}>Image URL (Optional)</label>
              <input
                type="url"
                value={properties.image || ""}
                onChange={(e) => onChange({ ...properties, image: e.target.value })}
                className={inputClasses}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </>
        )}
        
        {type === "image" && (
          <>
            <div>
              <label className={labelClasses}>Image URL</label>
              <input
                type="url"
                value={properties.src || ""}
                onChange={(e) => onChange({ ...properties, src: e.target.value })}
                className={inputClasses}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className={labelClasses}>Alt Text</label>
              <input
                type="text"
                value={properties.alt || ""}
                onChange={(e) => onChange({ ...properties, alt: e.target.value })}
                className={inputClasses}
                placeholder="Describe the image..."
              />
            </div>
          </>
        )}
      </div>

      {/* Styling Properties */}
      <div className={sectionClasses}>
        <h4 className="font-semibold text-gray-200 text-lg border-t border-gray-700 pt-4">Styling</h4>
        
        {/* Color Controls */}
        {type !== "heading" && type !== "card" && type !== "image" && (
          <div>
            <label className={labelClasses}>Background Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={properties.color || "#2563eb"}
                onChange={(e) => onChange({ ...properties, color: e.target.value })}
                className="w-12 h-10 border border-gray-600 rounded-md bg-gray-800 cursor-pointer"
              />
              <input
                type="text"
                value={properties.color || "#2563eb"}
                onChange={(e) => onChange({ ...properties, color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm"
                placeholder="#2563eb"
              />
            </div>
          </div>
        )}
        
        {type === "heading" && (
          <div>
            <label className={labelClasses}>Text Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={properties.color || "#171717"}
                onChange={(e) => onChange({ ...properties, color: e.target.value })}
                className="w-12 h-10 border border-gray-600 rounded-md bg-gray-800 cursor-pointer"
              />
              <input
                type="text"
                value={properties.color || "#171717"}
                onChange={(e) => onChange({ ...properties, color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm"
                placeholder="#171717"
              />
            </div>
          </div>
        )}

        {/* Font Size */}
        {type !== "card" && type !== "image" && (
          <div>
            <label className={labelClasses}>
              Font Size: {properties.fontSize || 16}px
            </label>
            <input
              type="range"
              min="8"
              max="64"
              value={properties.fontSize || 16}
              onChange={(e) => onChange({ ...properties, fontSize: Number(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>8px</span>
              <span>64px</span>
            </div>
          </div>
        )}

        {/* Font Weight */}
        {type !== "card" && type !== "image" && (
          <div>
            <label className={labelClasses}>Font Weight</label>
            <select
              value={properties.fontWeight || "normal"}
              onChange={(e) => onChange({ ...properties, fontWeight: e.target.value })}
              className={inputClasses}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="bolder">Bolder</option>
              <option value="lighter">Lighter</option>
            </select>
          </div>
        )}

        {/* Padding Controls - Available for all elements */}
        <div>
          <label className={labelClasses}>
            Padding: {properties.padding || (type === "card" ? 24 : 0)}px
          </label>
          <input
            type="range"
            min="0"
            max="48"
            value={properties.padding || (type === "card" ? 24 : 0)}
            onChange={(e) => onChange({ ...properties, padding: Number(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0px</span>
            <span>48px</span>
          </div>
        </div>

        {/* Margin Controls - Available for all elements */}
        <div>
          <label className={labelClasses}>
            Margin: {properties.margin || 0}px
          </label>
          <input
            type="range"
            min="0"
            max="32"
            value={properties.margin || 0}
            onChange={(e) => onChange({ ...properties, margin: Number(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0px</span>
            <span>32px</span>
          </div>
        </div>

        {/* Border Radius and Box Shadow - Available for most elements */}
        {type !== "heading" && (
          <>
            <div>
              <label className={labelClasses}>
                Border Radius: {properties.borderRadius || (type === "card" ? 12 : 6)}px
              </label>
              <input
                type="range"
                min="0"
                max="32"
                value={properties.borderRadius || (type === "card" ? 12 : 6)}
                onChange={(e) => onChange({ ...properties, borderRadius: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0px</span>
                <span>32px</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="boxShadow"
                checked={!!properties.boxShadow}
                onChange={(e) => onChange({ ...properties, boxShadow: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="boxShadow" className="text-sm font-medium text-gray-300">
                Enable Box Shadow
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
