// Volume conversion factors to tablespoons (tbsp)
export const volumeConversionToTbsp = {
  tsp: 1 / 3,
  tbsp: 1,
  cup: 16,
  "fl oz": 2,
  pint: 32,
  quart: 64,
  gallon: 256,
};

// Weight conversion factors to ounces (oz)
export const weightConversionToOz = {
  oz: 1,
  lb: 16,
};

// Define which units are count-based (non-convertible)
const countUnits = new Set([
  "whole",
  "clove",
  "stalk",
  "package",
  "slice",
  "bunch",
  "fillet",
  "pinch",
]);

// Determine unit type
export function getUnitType(unit) {
  unit = unit.toLowerCase();
  if (unit in volumeConversionToTbsp) return "volume";
  if (unit in weightConversionToOz) return "weight";
  if (countUnits.has(unit)) return "count";
  return "unknown";
}

// Convert volume to tbsp base unit
export function convertVolumeToTbsp(amount, unit) {
  const factor = volumeConversionToTbsp[unit.toLowerCase()];
  if (!factor) {
    throw new Error(`Unsupported volume unit: ${unit}`);
  }
  return amount * factor;
}

// Convert weight to oz base unit
export function convertWeightToOz(amount, unit) {
  const factor = weightConversionToOz[unit.toLowerCase()];
  if (!factor) {
    throw new Error(`Unsupported weight unit: ${unit}`);
  }
  return amount * factor;
}

// Convert from base volume (tbsp) back to best display unit
export function convertTbspToBestUnit(amount) {
  // Units sorted largest to smallest for display
  const units = [
    { unit: "cup", factor: volumeConversionToTbsp["cup"] },
    { unit: "tbsp", factor: volumeConversionToTbsp["tbsp"] },
    { unit: "tsp", factor: volumeConversionToTbsp["tsp"] },
  ];

  for (const { unit, factor } of units) {
    if (amount >= factor) {
      return {
        amount: Math.round((amount / factor) * 100) / 100, // round to 2 decimals
        unit,
      };
    }
  }
  // fallback to tsp if very small
  return {
    amount: Math.round(amount * 3 * 100) / 100, // convert tbsp -> tsp by multiplying by 3
    unit: "tsp",
  };
}

// Convert from base weight (oz) back to best display unit
export function convertOzToBestUnit(amount) {
  const units = [
    { unit: "lb", factor: weightConversionToOz["lb"] },
    { unit: "oz", factor: weightConversionToOz["oz"] },
  ];

  for (const { unit, factor } of units) {
    if (amount >= factor) {
      return {
        amount: Math.round((amount / factor) * 100) / 100,
        unit,
      };
    }
  }
  return { amount, unit: "oz" };
}

export function pluralizeUnit(unit, amount) {
  if (!unit) return "";

  const isPlural = Math.abs(amount - 1) > 0.01;

  // Use consistent casing (optional, depending on your data hygiene)
  const normalized = unit.toLowerCase();

  // Map of known plural forms
  const customPlurals = {
    whole: "whole",
    clove: "cloves",
    stalk: "stalks",
    package: "packages",
    slice: "slices",
    slices: "slices", // just in case
    bunch: "bunches",
    filet: "filets",
    pinch: "pinches",
  };

  // Use raw unit if not plural
  if (!isPlural) return unit;

  // Return known plural or fallback to adding "s"
  return customPlurals[normalized] || unit + "s";
}
