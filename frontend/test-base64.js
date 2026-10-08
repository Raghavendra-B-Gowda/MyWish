const data = { n: "Test", t: "course" };
const encoded = btoa(JSON.stringify(data)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
console.log("Encoded:", encoded);

let toDecode = encoded.replace(/-/g, '+').replace(/_/g, '/');
// Add padding
while (toDecode.length % 4) {
  toDecode += '=';
}

console.log("To decode:", toDecode);
console.log("Decoded:", atob(toDecode));
