import { parseMarkdownToNodes } from './parser.js';
import { renderNodesToHtml } from './render.js';
import PluginManager from './utils/PluginManager.js';

// Import the default CSS styles as a string (using `raw-loader` or equivalent in bundlers if needed)
import defaultStyles from './styles.css';

// Configuration object with options for styling
const config = {
  customStyles: '' // Empty by default; users can set this to add custom styles
};


/**
 * Updates the configuration with custom options
 * @param {Object} options - Custom configuration options
 * @param {Array} options.plugins - Array of plugins to add
 */
export function configure(options = {}) {
  Object.assign(config, options);

  // If plugins are provided in the options, add them to the PluginManager
  if (options.plugins && Array.isArray(options.plugins)) {
    options.plugins.forEach(plugin => pluginManager.addPlugin(plugin));
  }
}




const pluginManager = new PluginManager();
// pluginManager.addPlugin(examplePlugin); // Register plugins here



/**
 * Main function to parse and render markdown to HTML
 * @param {string} markdown - The markdown content
 * @returns {string} - The rendered HTML output
 */
export function markdownToOutput(markdown) {
  // Before parse hook
  const modifiedText = pluginManager.applyBeforeParse(markdown);
  
  // Markdown parsing process (replace with your parser)
  let nodes = parseMarkdownToNodes(modifiedText);
  nodes = nodes.map(node => pluginManager.applyNodeTransform(node));

  // Generate HTML from nodes
  let htmlOutput = renderNodesToHtml(nodes);

  // After parse hook
  return pluginManager.applyAfterParse(htmlOutput);

  // return renderNodesToHtml(nodes);
}
