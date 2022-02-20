export default function copy(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}
