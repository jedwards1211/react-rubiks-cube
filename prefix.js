var aliases = {
  transform:        true,
  transformStyle:   true,
  transformOrigin:  true,
  perspective:      true,
}

var prefixes = [
  'Webkit',
];

for (var prop in aliases) {
  aliases[prop] = prefixes.map(prefix => prefix + prop.charAt(0).toUpperCase() + prop.substring(1));
}

export default function prefix(style) {
  for (var prop in style) {
    if (aliases.hasOwnProperty(prop)) {
      for (var alias of aliases[prop]) {
        style[alias] = style[prop];
      }
    }
  }
  return style;
};