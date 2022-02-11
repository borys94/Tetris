const SIZE = 5;

export default function formatNumber(num: number) {
  var s = "000000000" + num;
  return s.substr(s.length - SIZE);
}
