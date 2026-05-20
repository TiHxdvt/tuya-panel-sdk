// Stub: native modules without Harmony version
const React = require('react');
const { View } = require('react-native');
function createStub(name) {
  return React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref })
  );
}
module.exports = new Proxy(
  { default: createStub('Stub'), __esModule: true },
  { get: (t, p) => (p in t ? t[p] : createStub(p)) }
);
