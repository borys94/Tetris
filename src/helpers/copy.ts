export default function copy(value: any) {
  return JSON.parse(JSON.stringify(value));
}
