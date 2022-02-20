export default function equal(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}
