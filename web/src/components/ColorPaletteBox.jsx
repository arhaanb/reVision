export default function ColorPaletteBox({ palette }) {
  return (
    <div className="w-full flex flex-col items-center mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Generated Color Palette</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
        {Object.entries(palette).map(([key, color]) => (
          <div key={key} className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg border shadow"
              style={{ backgroundColor: color }}
            />
            <span className="mt-2 text-xs text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <span className="text-xs font-mono text-gray-700">{color}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
