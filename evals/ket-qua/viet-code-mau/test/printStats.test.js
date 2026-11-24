const { test } = require('node:test');
const assert = require('node:assert/strict');
const { printStats } = require('../src/printStats');

// Sample layout from the task card. Image C is nested in the gap beside A.
const sampleLayout = () => ({
  rollWidthMm: 600,
  images: [
    { id: 'A', customer: 'Quán Mây', widthMm: 500, heightMm: 800, x: 0, y: 0 },
    { id: 'B', customer: 'Quán Mây', widthMm: 500, heightMm: 1200, x: 0, y: 800 },
    { id: 'C', customer: 'Tiệm Gió', widthMm: 80, heightMm: 300, x: 510, y: 0 },
  ],
});

test('each image reports its own printed length, even when nested', () => {
  const { images } = printStats(sampleLayout());
  assert.deepEqual(images, [
    { id: 'A', customer: 'Quán Mây', lengthMm: 800, meters: 0.8 },
    { id: 'B', customer: 'Quán Mây', lengthMm: 1200, meters: 1.2 },
    // Nested beside A: costs no extra paper, but the customer is still quoted 0.3 m.
    { id: 'C', customer: 'Tiệm Gió', lengthMm: 300, meters: 0.3 },
  ]);
});

test('customer totals sum their own images, in first-seen order', () => {
  const { customers } = printStats(sampleLayout());
  assert.deepEqual(customers, [
    { customer: 'Quán Mây', imageCount: 2, lengthMm: 2000, meters: 2 },
    { customer: 'Tiệm Gió', imageCount: 1, lengthMm: 300, meters: 0.3 },
  ]);
});

test('roll usage is the furthest bottom edge, separate from billed total', () => {
  const stats = printStats(sampleLayout());
  assert.equal(stats.rollUsedMm, 2000);
  assert.equal(stats.rollUsedMeters, 2);
  assert.equal(stats.billedMm, 2300);
  assert.equal(stats.billedMeters, 2.3);
  assert.equal(stats.rollWidthMm, 600);
});

test('roll usage counts an image that starts below a gap', () => {
  const stats = printStats({
    rollWidthMm: 600,
    images: [{ id: 'X', customer: 'K', widthMm: 100, heightMm: 250, x: 0, y: 1000 }],
  });
  assert.equal(stats.rollUsedMm, 1250);
  assert.equal(stats.billedMm, 250);
});

test('sums many odd lengths without float drift', () => {
  const images = Array.from({ length: 10 }, (_, i) => ({
    id: `I${i}`, customer: 'K', widthMm: 100, heightMm: 100, x: 0, y: i * 100,
  }));
  const stats = printStats({ rollWidthMm: 600, images });
  assert.equal(stats.customers[0].meters, 1); // not 0.9999999999999999
  assert.equal(stats.rollUsedMeters, 1);
});

test('empty layout returns zeros and empty lists', () => {
  assert.deepEqual(printStats({ rollWidthMm: 600, images: [] }), {
    rollWidthMm: 600,
    images: [],
    customers: [],
    billedMm: 0,
    billedMeters: 0,
    rollUsedMm: 0,
    rollUsedMeters: 0,
  });
});

test('rejects invalid layouts with a clear message', () => {
  const img = (over) => ({ id: 'A', customer: 'K', widthMm: 100, heightMm: 100, x: 0, y: 0, ...over });
  const cases = [
    [null, /layout/],
    [{ rollWidthMm: 0, images: [] }, /rollWidthMm/],
    [{ rollWidthMm: 600, images: 'x' }, /images/],
    [{ rollWidthMm: 600, images: [null] }, /image #0/],
    [{ rollWidthMm: 600, images: [img({ heightMm: 0 })] }, /heightMm/],
    [{ rollWidthMm: 600, images: [img({ widthMm: '100' })] }, /widthMm/],
    [{ rollWidthMm: 600, images: [img({ x: -1 })] }, /x/],
    [{ rollWidthMm: 600, images: [img({ y: Number.NaN })] }, /y/],
    [{ rollWidthMm: 600, images: [img({ id: '' })] }, /id/],
    [{ rollWidthMm: 600, images: [img({ customer: '  ' })] }, /customer/],
    [{ rollWidthMm: 600, images: [img({ x: 550 })] }, /exceeds roll width/],
    [{ rollWidthMm: 600, images: [img({}), img({ id: 'B', x: 50, y: 50 })] }, /overlap/],
  ];
  for (const [layout, message] of cases) {
    assert.throws(() => printStats(layout), message, JSON.stringify(layout));
  }
});

test('images touching edges are not treated as overlapping', () => {
  const stats = printStats({
    rollWidthMm: 600,
    images: [
      { id: 'A', customer: 'K', widthMm: 300, heightMm: 100, x: 0, y: 0 },
      { id: 'B', customer: 'K', widthMm: 300, heightMm: 100, x: 300, y: 0 },
      { id: 'C', customer: 'K', widthMm: 600, heightMm: 100, x: 0, y: 100 },
    ],
  });
  assert.equal(stats.rollUsedMm, 200);
  assert.equal(stats.billedMm, 300);
});
