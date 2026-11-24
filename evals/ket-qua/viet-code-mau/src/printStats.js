'use strict';

const MM_PER_METER = 1000;

// All sums are done in integer millimetres and converted once, so meters never drift.
const toMeters = (mm) => mm / MM_PER_METER;

function assertPositiveNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive number`);
  }
}

function assertNonNegativeNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(`${name} must be a non-negative number`);
  }
}

function assertNonEmptyString(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`);
  }
}

function validateImage(image, index, rollWidthMm) {
  const label = `image #${index}`;
  if (!image || typeof image !== 'object') throw new TypeError(`${label} must be an object`);
  assertNonEmptyString(image.id, `${label} id`);
  assertNonEmptyString(image.customer, `${label} customer`);
  assertPositiveNumber(image.widthMm, `${label} widthMm`);
  assertPositiveNumber(image.heightMm, `${label} heightMm`);
  assertNonNegativeNumber(image.x, `${label} x`);
  assertNonNegativeNumber(image.y, `${label} y`);
  if (image.x + image.widthMm > rollWidthMm) {
    throw new RangeError(`${label} (${image.id}) exceeds roll width ${rollWidthMm} mm`);
  }
}

const overlaps = (a, b) =>
  a.x < b.x + b.widthMm && b.x < a.x + a.widthMm &&
  a.y < b.y + b.heightMm && b.y < a.y + a.heightMm;

function validateLayout(layout) {
  if (!layout || typeof layout !== 'object') throw new TypeError('layout must be an object');
  assertPositiveNumber(layout.rollWidthMm, 'rollWidthMm');
  if (!Array.isArray(layout.images)) throw new TypeError('images must be an array');

  layout.images.forEach((image, i) => validateImage(image, i, layout.rollWidthMm));

  // Overlapping images mean a broken layout; the roll length would be wrong.
  layout.images.forEach((a, i) => {
    layout.images.slice(i + 1).forEach((b) => {
      if (overlaps(a, b)) throw new RangeError(`images ${a.id} and ${b.id} overlap`);
    });
  });
}

/**
 * Print statistics for one roll layout.
 *
 * Two different numbers on purpose:
 * - billed (per image / per customer): each image's own printed length, used to quote
 *   customers. Nesting an image beside another to save paper does not change it.
 * - roll used: real paper consumed after nesting = furthest bottom edge on the roll.
 */
function printStats(layout) {
  validateLayout(layout);

  const images = layout.images.map(({ id, customer, heightMm }) => ({
    id,
    customer,
    lengthMm: heightMm,
    meters: toMeters(heightMm),
  }));

  const byCustomer = new Map();
  for (const { customer, lengthMm } of images) {
    const entry = byCustomer.get(customer) ?? { customer, imageCount: 0, lengthMm: 0 };
    entry.imageCount += 1;
    entry.lengthMm += lengthMm;
    byCustomer.set(customer, entry);
  }
  const customers = [...byCustomer.values()].map((c) => ({ ...c, meters: toMeters(c.lengthMm) }));

  const billedMm = images.reduce((sum, img) => sum + img.lengthMm, 0);
  const rollUsedMm = layout.images.reduce((max, img) => Math.max(max, img.y + img.heightMm), 0);

  return {
    rollWidthMm: layout.rollWidthMm,
    images,
    customers,
    billedMm,
    billedMeters: toMeters(billedMm),
    rollUsedMm,
    rollUsedMeters: toMeters(rollUsedMm),
  };
}

module.exports = { printStats };
