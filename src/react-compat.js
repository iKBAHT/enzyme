/* eslint react/no-deprecated: 0 */
import objectAssign from 'object.assign';

const React = require('react');

let ReactDOM;
let TestUtils;

try {
  ReactDOM = require('react-dom');
} catch (e) {
  console.error(
    'react-dom is an implicit dependency in order to support react@0.13-14. ' +
    'Please add the appropriate version to your devDependencies. ' +
    'See https://github.com/airbnb/enzyme#installation'
  );
  throw e;
}

const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
const findDOMNode = ReactDOM.findDOMNode;
const unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
const batchedUpdates = ReactDOM.unstable_batchedUpdates;

// We require the testutils, but they don't come with 0.14 out of the box, so we
// require them here through this node module. The bummer is that we are not able
// to list this as a dependency in package.json and have 0.13 work properly.
// As a result, right now this is basically an implicit dependency.
try {
  TestUtils = require('react-addons-test-utils');
} catch (e) {
  console.error(
    'react-addons-test-utils is an implicit dependency in order to support react@0.13-14. ' +
    'Please add the appropriate version to your devDependencies. ' +
    'See https://github.com/airbnb/enzyme#installation'
  );
  throw e;
}

// Shallow rendering changed from 0.13 => 0.14 in such a way that
// 0.14 now does not allow shallow rendering of native DOM elements.
// This is mainly because the result of such a call should not realistically
// be any different than the JSX you passed in (result of `React.createElement`.
// In order to maintain the same behavior across versions, this function
// is essentially a replacement for `TestUtils.createRenderer` that doesn't use
// shallow rendering when it's just a DOM element.
const createShallowRenderer = function createRendererCompatible() {
  const renderer = TestUtils.createRenderer();
  const originalRender = renderer.render;
  const originalRenderOutput = renderer.getRenderOutput;
  let isDOM = false;
  let _node;
  return objectAssign(renderer, {
    render(node, context) {
      /* eslint consistent-return: 0 */
      if (typeof node.type === 'string') {
        isDOM = true;
        _node = node;
      } else {
        isDOM = false;
        return originalRender.call(this, node, context);
      }
    },
    getRenderOutput() {
      if (isDOM) {
        return _node;
      }
      return originalRenderOutput.call(this);
    },
  });
};
const renderIntoDocument = TestUtils.renderIntoDocument;
const childrenToArray = React.Children.toArray;

const renderWithOptions = (node, options) => {
  if (options.attachTo) {
    return ReactDOM.render(node, options.attachTo);
  }
  return TestUtils.renderIntoDocument(node);
};


const {
  mockComponent,
  isElement,
  isElementOfType,
  isDOMComponent,
  isCompositeComponent,
  isCompositeComponentWithType,
  isCompositeComponentElement,
  Simulate,
  findAllInRenderedTree,
} = TestUtils;

export {
  createShallowRenderer,
  renderToStaticMarkup,
  renderIntoDocument,
  mockComponent,
  isElement,
  isElementOfType,
  isDOMComponent,
  isCompositeComponent,
  isCompositeComponentWithType,
  isCompositeComponentElement,
  Simulate,
  findDOMNode,
  findAllInRenderedTree,
  childrenToArray,
  renderWithOptions,
  unmountComponentAtNode,
  batchedUpdates,
};
